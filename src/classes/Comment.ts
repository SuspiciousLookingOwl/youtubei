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
 * Represent a Comment
 *
 * TODO: Add replies
 */
export default class Comment extends Base implements CommentAttributes {
	/**
	 * The comment ID
	 */
	id!: string;
	video!: Video;
	author!: Channel;
	content!: string;
	publishDate!: string;
	likeCount!: number;
	isAuthorChannelOwner!: boolean;
	isPinnedComment!: boolean;
	replyCount!: number;

	constructor(channel: Partial<CommentAttributes> = {}) {
		super();
		Object.assign(this, channel);
	}

	/**
	 * Load instance attributes from youtube raw data
	 *
	 * @param youtubeRawData raw object from youtubei
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
	 * Link to video with highlighted comment
	 */
	get url(): string {
		return `https://www.youtube.com?watch=${this.video.id}&lc=${this.id}`;
	}
}
