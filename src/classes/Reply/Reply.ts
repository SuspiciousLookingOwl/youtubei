import { Base, BaseAttributes, ChannelCompact, Comment, ReplyParser, Video } from "..";
import { YoutubeRawData } from "../../common";

/** @hidden */
interface ReplyAttributes extends BaseAttributes {
	comment: Comment;
	video: Video;
	author: ChannelCompact;
	content: string;
	publishDate: string;
	likeCount: number;
	isAuthorChannelOwner: boolean;
}

/** Represents a Reply */
export class Reply extends Base implements ReplyAttributes {
	/** The comment this reply belongs to */
	comment!: Comment;
	/** The video this reply belongs to */
	video!: Video;
	/** The comment's author */
	author!: ChannelCompact;
	/** The content of this comment */
	content!: string;
	/** The publish date of the comment */
	publishDate!: string;
	/** How many likes does this comment have */
	likeCount!: number;
	/** Whether the comment is posted by the video uploader / owner */
	isAuthorChannelOwner!: boolean;

	/** @hidden */
	constructor(reply: Partial<ReplyAttributes> = {}) {
		super();
		Object.assign(this, reply);
	}

	/**
	 * Load this instance with raw data from Youtube
	 *
	 * @hidden
	 */
	load(data: YoutubeRawData): Reply {
		ReplyParser.loadReply(this, data);
		return this;
	}
}
