import { getContinuationFromItems, mapFilter, Thumbnails, YoutubeRawData } from "../../common";
import { BaseChannel } from "../BaseChannel";
import { Reply } from "../Reply";
import { Comment } from "./Comment";

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
		target.isPinned = !!pinnedCommentBadge;
		target.replyCount = replyCount;

		// Reply Continuation
		target.replies.continuation = data.replies
			? getContinuationFromItems(data.replies.commentRepliesRenderer.contents)
			: undefined;

		// Author
		const { browseId } = authorEndpoint.browseEndpoint;
		target.author = new BaseChannel({
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

	static parseReplies(data: YoutubeRawData, comment: Comment): Reply[] {
		const continuationItems =
			data.onResponseReceivedEndpoints[0].appendContinuationItemsAction.continuationItems;

		const rawReplies = mapFilter(continuationItems, "commentRenderer");

		return rawReplies.map((i: YoutubeRawData) =>
			new Reply({ video: comment.video, comment, client: comment.client }).load(i)
		);
	}
}
