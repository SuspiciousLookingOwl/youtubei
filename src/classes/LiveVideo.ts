import { EventEmitter } from "events";
import { applyMixins, http, YoutubeRawData } from "../common";
import { Chat, BaseVideo } from ".";
import { LIVE_CHAT_END_POINT } from "../constants";
import { BaseVideoAttributes } from "./BaseVideo";

/** @hidden */
interface LiveVideoAttributes extends BaseVideoAttributes {
	watchingCount: number;
}

interface LiveVideoEvents {
	chat: (chat: Chat) => void;
}

declare interface LiveVideo {
	on<T extends keyof LiveVideoEvents>(event: T, listener: LiveVideoEvents[T]): this;
	emit<T extends keyof LiveVideoEvents>(
		event: T,
		...args: Parameters<LiveVideoEvents[T]>
	): boolean;
}

/** Represents a video that's currently live, usually returned from `client.getVideo()` */
class LiveVideo extends BaseVideo implements LiveVideoAttributes {
	/** Number of people who's watching the live stream right now */
	watchingCount!: number;

	private _delay = 0;
	private _chatRequestPoolingTimeout!: NodeJS.Timeout;
	private _chatContinuation!: string;
	private _timeoutMs = 0;
	private _isChatPlaying = false;
	private _chatQueue: Chat[] = [];

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

		this._chatContinuation =
			data[3].response.contents.twoColumnWatchNextResults.conversationBar.liveChatRenderer.continuations[0].reloadContinuationData.continuation;

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
		const response = await http.post(LIVE_CHAT_END_POINT, {
			data: { continuation: this._chatContinuation },
		});

		this.parseChat(response.data);

		const timedContinuation =
			response.data.continuationContents.liveChatContinuation.continuations[0]
				.timedContinuationData;

		this._timeoutMs = timedContinuation.timeoutMs;
		this._chatContinuation = timedContinuation.continuation;
		this._chatRequestPoolingTimeout = setTimeout(
			() => this.pollChatContinuation(),
			this._timeoutMs
		);
	}

	/** Parse chat data from Youtube and add to chatQueue */
	private parseChat(data: YoutubeRawData): void {
		const chats = data.continuationContents.liveChatContinuation.actions.flatMap(
			(a: YoutubeRawData) => a.addChatItemAction?.item.liveChatTextMessageRenderer || []
		);

		for (const rawChatData of chats) {
			const chat = new Chat().load(rawChatData);
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
