"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReplyParser = void 0;
const common_1 = require("../../common");
const BaseChannel_1 = require("../BaseChannel");
class ReplyParser {
    static loadReply(target, data) {
        const { properties, toolbar, author, avatar } = data;
        // Basic information
        target.id = properties.commentId;
        target.content = properties.content.content;
        target.publishDate = properties.publishedTime;
        target.likeCount = +toolbar.likeCountLiked; // probably broken
        target.isAuthorChannelOwner = !!author.isCreator;
        // Author
        target.author = new BaseChannel_1.BaseChannel({
            id: author.id,
            name: author.displayName,
            thumbnails: new common_1.Thumbnails().load(avatar.image.sources),
            client: target.client,
        });
        return target;
    }
}
exports.ReplyParser = ReplyParser;
