import { Base, ChannelCompact, Thumbnails, Video, BaseAttributes, Reply } from ".";
import { getContinuationFromItems, mapFilter, YoutubeRawData } from "../common";
import { I_END_POINT } from "../constants";

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
}

/** Represents a Comment / Reply */
export default class Comment extends Base implements CommentAttributes {
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
	replies!: Reply[];

	private _replyContinuation?: string;

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
		const {
			authorText,
			authorThumbnail,
			authorEndpoint,
			contentText,
			publishedTimeText,
			commentId,
			voteCount,
			authorIsChannelOwner,
			pinnedCommentBadge,
			replyCount,
		} = data.comment.commentRenderer;

		// Basic information
		this.id = commentId;
		this.content = contentText.runs.map((r: YoutubeRawData) => r.text).join("");
		this.publishDate = publishedTimeText.runs.shift().text;
		this.likeCount = +(voteCount?.simpleText || 0);
		this.isAuthorChannelOwner = authorIsChannelOwner;
		this.isPinnedComment = !!pinnedCommentBadge;
		this.replyCount = replyCount;

		// Reply Continuation
		this.replies = [];

		this._replyContinuation = data.replies
			? getContinuationFromItems(data.replies.commentRepliesRenderer.contents)
			: undefined;

		// Author
		const { browseId } = authorEndpoint.browseEndpoint;
		this.author = new ChannelCompact({
			id: browseId,
			name: authorText.simpleText,
			thumbnails: new Thumbnails().load(authorThumbnail.thumbnails),
			client: this.client,
		});

		return this;
	}

	/** URL to the video with this comment being highlighted (appears on top of the comment section) */
	get url(): string {
		return `https://www.youtube.com/watch?v=${this.video.id}&lc=${this.id}`;
	}

	/** Load next replies of the comment */
	async nextReplies(count = 1): Promise<Reply[]> {
		const newReplies: Reply[] = [];
		for (let i = 0; i < count || count == 0; i++) {
			if (!this._replyContinuation) break;

			// Send request
			const response = await this.client.http.post(`${I_END_POINT}/next`, {
				data: { continuation: this._replyContinuation },
			});

			const continuationItems =
				response.data.onResponseReceivedEndpoints[0].appendContinuationItemsAction
					.continuationItems;

			this._replyContinuation = getContinuationFromItems(continuationItems, [
				"button",
				"buttonRenderer",
				"command",
			]);

			const replies = mapFilter(continuationItems, "commentRenderer");
			newReplies.push(
				...replies.map((i: YoutubeRawData) =>
					new Reply({ video: this.video, comment: this, client: this.client }).load(i)
				)
			);
		}

		this.replies.push(...newReplies);
		return newReplies;
	}
}
