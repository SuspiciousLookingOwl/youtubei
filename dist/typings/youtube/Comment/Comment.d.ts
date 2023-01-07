import { YoutubeRawData } from "../../common";
import { Base, BaseProperties } from "../Base";
import { BaseChannel } from "../BaseChannel";
import { Video } from "../Video";
import { CommentReplies } from "./CommentReplies";
/** @hidden */
interface CommentProperties extends BaseProperties {
    id?: string;
    video?: Video;
    author?: BaseChannel;
    content?: string;
    publishDate?: string;
    likeCount?: number;
    isAuthorChannelOwner?: boolean;
    isPinned?: boolean;
    replyCount?: number;
    replies?: CommentReplies;
}
/** Represents a Comment / Reply */
export declare class Comment extends Base implements CommentProperties {
    id: string;
    /** The video this comment belongs to */
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
    /** Whether the comment is pinned */
    isPinned: boolean;
    /** Reply count of this comment */
    replyCount: number;
    /** Continuable of replies in this comment */
    replies: CommentReplies;
    /** @hidden */
    constructor(attr: CommentProperties);
    /**
     * Load this instance with raw data from Youtube
     *
     * @hidden
     */
    load(data: YoutubeRawData): Comment;
    /** URL to the video with this comment being highlighted (appears on top of the comment section) */
    get url(): string;
}
export {};
