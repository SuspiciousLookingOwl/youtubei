import { YoutubeRawData } from "../../common";
import { Base, BaseProperties } from "../Base";
import { BaseChannel } from "../BaseChannel";
/** @hidden */
interface PostProperties extends BaseProperties {
    id?: string;
    channel?: BaseChannel;
    content?: string;
    timestamp?: string;
    voteCount?: string;
}
/** Represents a chat in a live stream */
export declare class Post extends Base implements PostProperties {
    id?: string;
    /** The channel who posted this post */
    channel: BaseChannel;
    /** The content of this post */
    content: string;
    /** Timestamp */
    timestamp: string;
    /** Vote count like '1.2K likes' */
    voteCount: string;
    /** @hidden */
    constructor(attr: PostProperties);
    /**
     * Load this instance with raw data from Youtube
     *
     * @hidden
     */
    load(data: YoutubeRawData): Post;
}
export {};
