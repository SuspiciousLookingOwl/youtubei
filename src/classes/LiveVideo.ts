import { EventEmitter } from "events";
import { applyMixins, YoutubeRawData } from "../common";
import { Chat, BaseVideo, BaseVideoAttributes } from ".";
import { LIVE_CHAT_END_POINT } from "../constants";

/** @hidden */
interface LiveVideoAttributes extends BaseVideoAttributes {
	watchingCount: number;
	chatContinuation?: string;
}

interface LiveVideoEvents {
	chat: (chat: Chat) => void;
}

declare interface LiveVideo {
	on<T extends keyof LiveVideoEvents>(
		event: T,
		listener: LiveVideoEvents[T]
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
	): AsyncIterableIterator<any>;
	emit<T extends keyof LiveVideoEvents>(
		event: T,
		...args: Parameters<LiveVideoEvents[T]>
	): boolean;
}

/** Represents a video that's currently live, usually returned from `client.getVideo()` */
class LiveVideo extends BaseVideo implements LiveVideoAttributes {
	/** Number of people who's watching the live stream right now */
	watchingCount!: number;
	/** Current continuation token to load next chat  */
	chatContinuation!: string;

	private _delay = 0;
	private _chatRequestPoolingTimeout!: NodeJS.Timeout;
	private _timeoutMs = 0;
	private _isChatPlaying = false;
	private _chatQueue: Chat[] = [];

	/** @hidden */
	constructor(video: Partial<LiveVideoAttributes> = {}) {
		super();
		Object.assign(this, video);
	}

	/**
	 * Load this instance with raw data from Youtube
	 *
	 * @hidden
	 */
	load(data: YoutubeRawData): LiveVideo {
		super.load(data);

		const videoInfo = BaseVideo.parseRawData(data);

		this.watchingCount = +videoInfo.viewCount.videoViewCountRenderer.viewCount.runs
			.map((r: YoutubeRawData) => r.text)
			.join(" ")
			.replace(/[^0-9]/g, "");

		this.chatContinuation =
			data[3].response.contents.twoColumnWatchNextResults.conversationBar.liveChatRenderer?.continuations[0].reloadContinuationData.continuation;

		return this;
	}

	/**
	 * Start polling for get live chat request
	 *
	 * @param delay chat delay in millisecond
	 */
	playChat(delay = 0): void {
		if (this._isChatPlaying) return;
		this._delay = delay;
		this._isChatPlaying = true;
		this.pollChatContinuation();
	}

	/** Stop request polling for live chat */
	stopChat(): void {
		if (!this._chatRequestPoolingTimeout) return;
		this._isChatPlaying = false;
		clearTimeout(this._chatRequestPoolingTimeout);
	}

	/** Start request polling */
	private async pollChatContinuation() {
		const response = await this.client.http.post(LIVE_CHAT_END_POINT, {
			data: { continuation: this.chatContinuation },
		});

		if (!response.data.continuationContents) return;
		this.parseChat(response.data);

		const continuation =
			response.data.continuationContents.liveChatContinuation.continuations[0];
		const continuationData =
			continuation.timedContinuationData || continuation.invalidationContinuationData;

		this._timeoutMs = continuationData.timeoutMs;
		this.chatContinuation = continuationData.continuation;
		this._chatRequestPoolingTimeout = setTimeout(
			() => this.pollChatContinuation(),
			this._timeoutMs
		);
	}

	/** Parse chat data from Youtube and add to chatQueue */
	private parseChat(data: YoutubeRawData): void {
		const chats =
			data.continuationContents.liveChatContinuation.actions?.flatMap(
				(a: YoutubeRawData) => a.addChatItemAction?.item.liveChatTextMessageRenderer || []
			) || [];

		for (const rawChatData of chats) {
			const chat = new Chat({ client: this.client }).load(rawChatData);
			if (this._chatQueue.find((c) => c.id === chat.id)) continue;
			this._chatQueue.push(chat);
			setTimeout(() => {
				this.emit("chat", chat);
			}, chat.timestamp / 1000 - (new Date().getTime() - this._delay));
		}
	}
}

applyMixins(LiveVideo, [EventEmitter]);
export default LiveVideo;
