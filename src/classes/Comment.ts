import { Base, Channel, Thumbnails, Video } from ".";
import { YoutubeRawData } from "../common";

interface CommentAttributes {
	id: string;
	video: Video;
	author: Channel;
	content: string;
	publishDate: string;
	likeCount: number;
	isAuthorChannelOwner: boolean;
	isPinnedComment: boolean;
	replyCount: number;
}

/**
 * Represents a Comment / Reply
 */
export default class Comment extends Base implements CommentAttributes {
	/** The comment's ID */
	id!: string;
	/** The video this comment belongs to */
	video!: Video;
	/** The comment's author */
	author!: Channel;
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

	// TODO: Add replies

	/** @hidden */
	constructor(channel: Partial<CommentAttributes> = {}) {
		super();
		Object.assign(this, channel);
	}

	/**
	 * Load instance attributes from youtube raw data
	 *
	 * @param youtubeRawData raw object from youtubei
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
			likeCount,
			authorIsChannelOwner,
			pinnedCommentBadge,
			replyCount,
		} = data.comment.commentRenderer;

		// Basic information
		this.id = commentId;
		this.content = contentText.runs.map((r: YoutubeRawData) => r.text).join("");
		this.publishDate = publishedTimeText.runs.shift().text;
		this.likeCount = likeCount;
		this.isAuthorChannelOwner = authorIsChannelOwner;
		this.isPinnedComment = !!pinnedCommentBadge;
		this.replyCount = replyCount;

		// Author
		const { browseId, canonicalBaseUrl } = authorEndpoint.browseEndpoint;
		this.author = new Channel({
			id: browseId,
			name: authorText.simpleText,
			thumbnails: new Thumbnails().load(authorThumbnail.thumbnails),
			url: "https://www.youtube.com" + (canonicalBaseUrl || `/channel/${browseId}`),
		});

		return this;
	}

	/**
	 * URL to the video with this comment being highlighted (appear on top of the comment)
	 */
	get url(): string {
		return `https://www.youtube.com?watch=${this.video.id}&lc=${this.id}`;
	}
}
