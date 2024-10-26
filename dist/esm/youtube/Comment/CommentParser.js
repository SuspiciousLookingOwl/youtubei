import { getContinuationFromItems, Thumbnails } from "../../common";
import { BaseChannel } from "../BaseChannel";
import { Comment } from "./Comment";
var CommentParser = /** @class */ (function () {
    function CommentParser() {
    }
    CommentParser.loadComment = function (target, data) {
        var properties = data.properties, toolbar = data.toolbar, author = data.author, avatar = data.avatar;
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
    };
    CommentParser.parseContinuation = function (data) {
        var continuationItems = data.onResponseReceivedEndpoints[0].appendContinuationItemsAction.continuationItems;
        return getContinuationFromItems(continuationItems, ["button", "buttonRenderer", "command"]);
    };
    CommentParser.parseReplies = function (data, comment) {
        var replies = data.frameworkUpdates.entityBatchUpdate.mutations
            .filter(function (e) { return e.payload.commentEntityPayload; })
            .map(function (e) { return e.payload.commentEntityPayload; });
        return replies.map(function (i) {
            return new Comment({ video: comment.video, client: comment.client }).load(i);
        });
    };
    return CommentParser;
}());
export { CommentParser };
