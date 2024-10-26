import { getContinuationFromItems, Thumbnails, YoutubeRawData } from "../../common";
import { BaseChannel } from "../BaseChannel";
import { Reply } from "../Reply";
import { Comment } from "./Comment";

export class CommentParser {
	static loadComment(target: Comment, data: YoutubeRawData): Comment {
		const { properties, toolbar, author, avatar } = data;

		// Basic information
		target.id = properties.commentId;
		target.content = properties.content.content;
		target.publishDate = properties.publishedTime;
		target.likeCount = +toolbar.likeCountLiked; // probably broken
		target.isAuthorChannelOwner = !!author.isCreator;
		target.isPinned = false; // TODO fix this
		target.replyCount = +toolbar.replyCount;

		// Reply Continuation
		target.replies.continuation = data.replies
			? getContinuationFromItems(data.replies.commentRepliesRenderer.contents)
			: undefined;

		// Author
		target.author = new BaseChannel({
			id: author.id,
			name: author.displayName,
			thumbnails: new Thumbnails().load(avatar.image.sources),
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
		const replies = data.frameworkUpdates.entityBatchUpdate.mutations
			.filter((e: YoutubeRawData) => e.payload.commentEntityPayload)
			.map((e: YoutubeRawData) => e.payload.commentEntityPayload);

		return replies.map((i: YoutubeRawData) =>
			new Comment({ video: comment.video, client: comment.client }).load(i)
		);
	}
}
