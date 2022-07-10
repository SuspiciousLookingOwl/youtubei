import { Base, BaseAttributes, ChannelCompact, Reply, Video } from "..";
import { YoutubeRawData } from "../../common";
import { I_END_POINT } from "../../constants";
import { CommentParser } from "./CommentParser";

/** @hidden */
interface CommentAttributes extends BaseAttributes {
	video: Video;
	author: ChannelCompact;
	content: string;
	publishDate: string;
	likeCount: number;
	isAuthorChannelOwner: boolean;
	isPinnedComment: boolean;
	replyCount: number;
	replyContinuation?: string;
}

/** Represents a Comment / Reply */
export class Comment extends Base implements CommentAttributes {
	/** The video this comment belongs to */
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
	/** Whether the comment is pinned */
	isPinnedComment!: boolean;
	/** Comment's reply count */
	replyCount!: number;
	/** Comment's loaded replies */
	replies: Reply[] = [];
	/** Current continuation token to load next replies  */
	replyContinuation?: string;

	/** @hidden */
	constructor(comment: Partial<CommentAttributes> = {}) {
		super();
		Object.assign(this, comment);
	}

	/**
	 * Load this instance with raw data from Youtube
	 *
	 * @hidden
	 */
	load(data: YoutubeRawData): Comment {
		CommentParser.loadComment(this, data);
		return this;
	}

	/** URL to the video with this comment being highlighted (appears on top of the comment section) */
	get url(): string {
		return `https://www.youtube.com/watch?v=${this.video.id}&lc=${this.id}`;
	}

	/** Load next replies of the comment */
	async nextReplies(count = 1): Promise<Reply[]> {
		let newReplies: Reply[] = [];
		for (let i = 0; i < count || count == 0; i++) {
			if (!this.replyContinuation) break;

			// Send request
			const response = await this.client.http.post(`${I_END_POINT}/next`, {
				data: { continuation: this.replyContinuation },
			});

			this.replyContinuation = CommentParser.parseContinuation(response.data);
			newReplies = CommentParser.parseReplies(response.data, this);
		}

		this.replies.push(...newReplies);
		return newReplies;
	}
}