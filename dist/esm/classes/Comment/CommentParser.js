import { getContinuationFromItems, mapFilter, Thumbnails } from "../../common";
import { BaseChannel } from "../BaseChannel";
import { Reply } from "../Reply";
var CommentParser = /** @class */ (function () {
    function CommentParser() {
    }
    CommentParser.loadComment = function (target, data) {
        var _a = data.comment.commentRenderer, authorText = _a.authorText, authorThumbnail = _a.authorThumbnail, authorEndpoint = _a.authorEndpoint, contentText = _a.contentText, publishedTimeText = _a.publishedTimeText, commentId = _a.commentId, voteCount = _a.voteCount, authorIsChannelOwner = _a.authorIsChannelOwner, pinnedCommentBadge = _a.pinnedCommentBadge, replyCount = _a.replyCount;
        // Basic information
        target.id = commentId;
        target.content = contentText.runs.map(function (r) { return r.text; }).join("");
        target.publishDate = publishedTimeText.runs.shift().text;
        target.likeCount = +((voteCount === null || voteCount === void 0 ? void 0 : voteCount.simpleText) || 0);
        target.isAuthorChannelOwner = authorIsChannelOwner;
        target.isPinned = !!pinnedCommentBadge;
        target.replyCount = replyCount;
        // Reply Continuation
        target.replies.continuation = data.replies
            ? getContinuationFromItems(data.replies.commentRepliesRenderer.contents)
            : undefined;
        // Author
        var browseId = authorEndpoint.browseEndpoint.browseId;
        target.author = new BaseChannel({
            id: browseId,
            name: authorText.simpleText,
            thumbnails: new Thumbnails().load(authorThumbnail.thumbnails),
            client: target.client,
        });
        return target;
    };
    CommentParser.parseContinuation = function (data) {
        var continuationItems = data.onResponseReceivedEndpoints[0].appendContinuationItemsAction.continuationItems;
        return getContinuationFromItems(continuationItems, ["button", "buttonRenderer", "command"]);
    };
    CommentParser.parseReplies = function (data, comment) {
        var continuationItems = data.onResponseReceivedEndpoints[0].appendContinuationItemsAction.continuationItems;
        var rawReplies = mapFilter(continuationItems, "commentRenderer");
        return rawReplies.map(function (i) {
            return new Reply({ video: comment.video, comment: comment, client: comment.client }).load(i);
        });
    };
    return CommentParser;
}());
export { CommentParser };
