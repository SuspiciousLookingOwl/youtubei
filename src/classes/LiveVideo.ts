import { EventEmitter } from "events";
import { applyMixins, http, YoutubeRawData } from "../common";
import { Chat, Video } from ".";
import { LIVE_CHAT_END_POINT } from "../constants";

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

class LiveVideo extends Video {
	delay = 0;

	private _chatRequestPoolingTimeout!: NodeJS.Timeout;
	private _chatContinuation!: string;
	private _timeoutMs = 0;
	private _chatQueue: Chat[] = [];

	/** @hidden */
	load(data: YoutubeRawData): LiveVideo {
		super.load(data);

		this._chatContinuation =
			data[3].response.contents.twoColumnWatchNextResults.conversationBar.liveChatRenderer.continuations[0].reloadContinuationData.continuation;

		return this;
	}

	/**
	 * Start polling for get live chat request
	 *
	 * @param delay chat delay in millisecond
	 */
	async playChat(delay = 0): Promise<void> {
		this.delay = delay;
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
			() => this.playChat(this.delay),
			this._timeoutMs
		);
	}

	/** @hidden */
	parseChat(data: YoutubeRawData): void {
		const chats = data.continuationContents.liveChatContinuation.actions.flatMap(
			(a: YoutubeRawData) => a.addChatItemAction?.item.liveChatTextMessageRenderer || []
		);

		for (const rawChatData of chats) {
			const chat = new Chat().load(rawChatData);
			if (this._chatQueue.find((c) => c.id === chat.id)) continue;
			this._chatQueue.push(chat);
			setTimeout(() => {
				this.emit("chat", chat);
			}, chat.timestamp / 1000 - (new Date().getTime() - this.delay));
		}
	}
}

applyMixins(LiveVideo, [EventEmitter]);
export default LiveVideo;
