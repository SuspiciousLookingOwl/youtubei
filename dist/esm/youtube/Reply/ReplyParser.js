import { Thumbnails } from "../../common";
import { BaseChannel } from "../BaseChannel";
var ReplyParser = /** @class */ (function () {
    function ReplyParser() {
    }
    ReplyParser.loadReply = function (target, data) {
        var properties = data.properties, toolbar = data.toolbar, author = data.author, avatar = data.avatar;
        // Basic information
        target.id = properties.commentId;
        target.content = properties.content.content;
        target.publishDate = properties.publishedTime;
        target.likeCount = +toolbar.likeCountLiked; // probably broken
        target.isAuthorChannelOwner = !!author.isCreator;
        // Author
        target.author = new BaseChannel({
            id: author.id,
            name: author.displayName,
            thumbnails: new Thumbnails().load(avatar.image.sources),
            client: target.client,
        });
        return target;
    };
    return ReplyParser;
}());
export { ReplyParser };
