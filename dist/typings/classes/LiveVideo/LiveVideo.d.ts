import { YoutubeRawData } from "../../common";
import { BaseVideo, BaseVideoProperties } from "../BaseVideo";
import { Chat } from "../Chat";
/** @hidden */
interface LiveVideoProperties extends BaseVideoProperties {
    watchingCount?: number;
    chatContinuation?: string;
}
interface LiveVideoEvents {
    chat: (chat: Chat) => void;
}
declare interface LiveVideo {
    on<T extends keyof LiveVideoEvents>(event: T, listener: LiveVideoEvents[T]): AsyncIterableIterator<any>;
    emit<T extends keyof LiveVideoEvents>(event: T, ...args: Parameters<LiveVideoEvents[T]>): boolean;
}
/** Represents a video that's currently live, usually returned from `client.getVideo()` */
declare class LiveVideo extends BaseVideo implements LiveVideoProperties {
    /** Number of people who's watching the live stream right now */
    watchingCount: number;
    /** Current continuation token to load next chat  */
    chatContinuation: string;
    private _delay;
    private _chatRequestPoolingTimeout;
    private _timeoutMs;
    private _isChatPlaying;
    private _chatQueue;
    /** @hidden */
    constructor(attr: LiveVideoProperties);
    /**
     * Load this instance with raw data from Youtube
     *
     * @hidden
     */
    load(data: YoutubeRawData): LiveVideo;
    /**
     * Start polling for get live chat request
     *
     * @param delay chat delay in millisecond
     */
    playChat(delay?: number): void;
    /** Stop request polling for live chat */
    stopChat(): void;
    /** Start request polling */
    private pollChatContinuation;
}
export { LiveVideo };
