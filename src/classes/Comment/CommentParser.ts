import { ChannelCompact, Comment, Thumbnails } from "..";
import { getContinuationFromItems, mapFilter, YoutubeRawData } from "../../common";

export class CommentParser {
	static loadComment(target: Comment, data: YoutubeRawData): Comment {
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
		target.id = commentId;
		target.content = contentText.runs.map((r: YoutubeRawData) => r.text).join("");
		target.publishDate = publishedTimeText.runs.shift().text;
		target.likeCount = +(voteCount?.simpleText || 0);
		target.isAuthorChannelOwner = authorIsChannelOwner;
		target.isPinnedComment = !!pinnedCommentBadge;
		target.replyCount = replyCount;

		// Reply Continuation
		target.replyContinuation = data.replies
			? getContinuationFromItems(data.replies.commentRepliesRenderer.contents)
			: undefined;

		// Author
		const { browseId } = authorEndpoint.browseEndpoint;
		target.author = new ChannelCompact({
			id: browseId,
			name: authorText.simpleText,
			thumbnails: new Thumbnails().load(authorThumbnail.thumbnails),
			client: target.client,
		});

		return target;
	}

	static parseContinuation(data: YoutubeRawData): string | undefined {
		const continuationItems =
			data.onResponseReceivedEndpoints[0].appendContinuationItemsAction.continuationItems;

		return getContinuationFromItems(continuationItems, ["button", "buttonRenderer", "command"]);
	}

	static parseReplies(data: YoutubeRawData): YoutubeRawData {
		const continuationItems =
			data.onResponseReceivedEndpoints[0].appendContinuationItemsAction.continuationItems;

		return mapFilter(continuationItems, "commentRenderer");
	}
}
