import { EventEmitter } from "events";

import { applyMixins, YoutubeRawData } from "../../common";
import { BaseVideo, BaseVideoProperties } from "../BaseVideo";
import { Chat } from "../Chat";
import { LIVE_CHAT_END_POINT } from "../constants";
import { LiveVideoParser } from "./LiveVideoParser";

/** @hidden */
interface LiveVideoProperties extends BaseVideoProperties {
	watchingCount?: number;
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
class LiveVideo extends BaseVideo implements LiveVideoProperties {
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
	constructor(attr: LiveVideoProperties) {
		super(attr);
		Object.assign(this, attr);
	}

	/**
	 * Load this instance with raw data from Youtube
	 *
	 * @hidden
	 */
	load(data: YoutubeRawData): LiveVideo {
		super.load(data);
		LiveVideoParser.loadLiveVideo(this, data);
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
		const chats = LiveVideoParser.parseChats(response.data);

		for (const c of chats) {
			const chat = new Chat({ client: this.client }).load(c);
			if (this._chatQueue.find((c) => c.id === chat.id)) continue;
			this._chatQueue.push(chat);

			const timeout = chat.timestamp / 1000 - (new Date().getTime() - this._delay);
			setTimeout(() => this.emit("chat", chat), timeout);
		}

		const { timeout, continuation } = LiveVideoParser.parseContinuation(response.data);

		this._timeoutMs = timeout;
		this.chatContinuation = continuation;
		this._chatRequestPoolingTimeout = setTimeout(
			() => this.pollChatContinuation(),
			this._timeoutMs
		);
	}

	/** Parse chat data from Youtube and add to chatQueue */
}

applyMixins(LiveVideo, [EventEmitter]);
export { LiveVideo };
