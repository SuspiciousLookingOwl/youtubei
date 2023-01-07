import { YoutubeRawData } from "../../common";
import { Base, BaseProperties } from "../Base";
import { BaseChannel } from "../BaseChannel";
import { Comment } from "../Comment";
import { Video } from "../Video";
/** @hidden */
interface ReplyProperties extends BaseProperties {
    id?: string;
    comment?: Comment;
    video?: Video;
    author?: BaseChannel;
    content?: string;
    publishDate?: string;
    likeCount?: number;
    isAuthorChannelOwner?: boolean;
}
/** Represents a Reply */
export declare class Reply extends Base implements ReplyProperties {
    id: string;
    /** The comment this reply belongs to */
    comment: Comment;
    /** The video this reply belongs to */
    video: Video;
    /** The comment's author */
    author: BaseChannel;
    /** The content of this comment */
    content: string;
    /** The publish date of the comment */
    publishDate: string;
    /** How many likes does this comment have */
    likeCount: number;
    /** Whether the comment is posted by the video uploader / owner */
    isAuthorChannelOwner: boolean;
    /** @hidden */
    constructor(attr: ReplyProperties);
    /**
     * Load this instance with raw data from Youtube
     *
     * @hidden
     */
    load(data: YoutubeRawData): Reply;
}
export {};
