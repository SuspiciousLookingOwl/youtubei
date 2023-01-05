import { Thumbnails } from "../../common";
import { BaseChannel } from "../BaseChannel";
var ReplyParser = /** @class */ (function () {
    function ReplyParser() {
    }
    ReplyParser.loadReply = function (target, data) {
        var authorText = data.authorText, authorThumbnail = data.authorThumbnail, authorEndpoint = data.authorEndpoint, contentText = data.contentText, publishedTimeText = data.publishedTimeText, commentId = data.commentId, likeCount = data.likeCount, authorIsChannelOwner = data.authorIsChannelOwner;
        // Basic information
        target.id = commentId;
        target.content = contentText.runs.map(function (r) { return r.text; }).join("");
        target.publishDate = publishedTimeText.runs.shift().text;
        target.likeCount = likeCount;
        target.isAuthorChannelOwner = authorIsChannelOwner;
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
    return ReplyParser;
}());
export { ReplyParser };
