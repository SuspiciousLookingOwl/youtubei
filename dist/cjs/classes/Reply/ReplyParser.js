"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReplyParser = void 0;
const BaseChannel_1 = require("../BaseChannel");
const Thumbnails_1 = require("../Thumbnails");
class ReplyParser {
    static loadReply(target, data) {
        const { authorText, authorThumbnail, authorEndpoint, contentText, publishedTimeText, commentId, likeCount, authorIsChannelOwner, } = data;
        // Basic information
        target.id = commentId;
        target.content = contentText.runs.map((r) => r.text).join("");
        target.publishDate = publishedTimeText.runs.shift().text;
        target.likeCount = likeCount;
        target.isAuthorChannelOwner = authorIsChannelOwner;
        // Author
        const { browseId } = authorEndpoint.browseEndpoint;
        target.author = new BaseChannel_1.BaseChannel({
            id: browseId,
            name: authorText.simpleText,
            thumbnails: new Thumbnails_1.Thumbnails().load(authorThumbnail.thumbnails),
            client: target.client,
        });
        return target;
    }
}
exports.ReplyParser = ReplyParser;
