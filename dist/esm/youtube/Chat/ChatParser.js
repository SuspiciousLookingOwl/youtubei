import { BaseChannel } from "../BaseChannel";
var ChatParser = /** @class */ (function () {
    function ChatParser() {
    }
    ChatParser.loadChat = function (target, data) {
        var id = data.id, message = data.message, authorName = data.authorName, authorPhoto = data.authorPhoto, timestampUsec = data.timestampUsec, authorExternalChannelId = data.authorExternalChannelId;
        // Basic information
        target.id = id;
        target.message = message.runs.map(function (r) { return r.text; }).join("");
        target.author = new BaseChannel({
            id: authorExternalChannelId,
            name: authorName.simpleText,
            thumbnails: authorPhoto.thumbnails,
            client: target.client,
        });
        target.timestamp = +timestampUsec;
        return target;
    };
    return ChatParser;
}());
export { ChatParser };
