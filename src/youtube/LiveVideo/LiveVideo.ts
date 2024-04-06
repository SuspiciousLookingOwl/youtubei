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

	private delay = 0;
	private chatRequestPoolingTimeout!: NodeJS.Timeout;
	private timeoutMs = 0;
	private isChatPlaying = false;
	private chatQueue: Chat[] = [];

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
		if (this.isChatPlaying) return;
		this.delay = delay;
		this.isChatPlaying = true;
		this.pollChatContinuation();
	}

	/** Stop request polling for live chat */
	stopChat(): void {
		if (!this.chatRequestPoolingTimeout) return;
		this.isChatPlaying = false;
		clearTimeout(this.chatRequestPoolingTimeout);
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
			if (this.chatQueue.find((c) => c.id === chat.id)) continue;
			this.chatQueue.push(chat);

			const timeout = chat.timestamp / 1000 - (new Date().getTime() - this.delay);
			setTimeout(() => this.emit("chat", chat), timeout);
		}

		const { timeout, continuation } = LiveVideoParser.parseContinuation(response.data);

		this.timeoutMs = timeout;
		this.chatContinuation = continuation;
		this.chatRequestPoolingTimeout = setTimeout(
			() => this.pollChatContinuation(),
			this.timeoutMs
		);
	}

	/** Parse chat data from Youtube and add to chatQueue */
}

applyMixins(LiveVideo, [EventEmitter]);
export { LiveVideo };
