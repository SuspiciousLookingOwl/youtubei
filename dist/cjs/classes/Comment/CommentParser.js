"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CommentParser = void 0;
const common_1 = require("../../common");
const BaseChannel_1 = require("../BaseChannel");
const Reply_1 = require("../Reply");
class CommentParser {
    static loadComment(target, data) {
        const { authorText, authorThumbnail, authorEndpoint, contentText, publishedTimeText, commentId, voteCount, authorIsChannelOwner, pinnedCommentBadge, replyCount, } = data.comment.commentRenderer;
        // Basic information
        target.id = commentId;
        target.content = contentText.runs.map((r) => r.text).join("");
        target.publishDate = publishedTimeText.runs.shift().text;
        target.likeCount = +((voteCount === null || voteCount === void 0 ? void 0 : voteCount.simpleText) || 0);
        target.isAuthorChannelOwner = authorIsChannelOwner;
        target.isPinned = !!pinnedCommentBadge;
        target.replyCount = replyCount;
        // Reply Continuation
        target.replies.continuation = data.replies
            ? common_1.getContinuationFromItems(data.replies.commentRepliesRenderer.contents)
            : undefined;
        // Author
        const { browseId } = authorEndpoint.browseEndpoint;
        target.author = new BaseChannel_1.BaseChannel({
            id: browseId,
            name: authorText.simpleText,
            thumbnails: new common_1.Thumbnails().load(authorThumbnail.thumbnails),
            client: target.client,
        });
        return target;
    }
    static parseContinuation(data) {
        const continuationItems = data.onResponseReceivedEndpoints[0].appendContinuationItemsAction.continuationItems;
        return common_1.getContinuationFromItems(continuationItems, ["button", "buttonRenderer", "command"]);
    }
    static parseReplies(data, comment) {
        const continuationItems = data.onResponseReceivedEndpoints[0].appendContinuationItemsAction.continuationItems;
        const rawReplies = common_1.mapFilter(continuationItems, "commentRenderer");
        return rawReplies.map((i) => new Reply_1.Reply({ video: comment.video, comment, client: comment.client }).load(i));
    }
}
exports.CommentParser = CommentParser;
