"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChatParser = void 0;
const BaseChannel_1 = require("../BaseChannel");
class ChatParser {
    static loadChat(target, data) {
        const { id, message, authorName, authorPhoto, timestampUsec, authorExternalChannelId, } = data;
        // Basic information
        target.id = id;
        target.message = message.runs.map((r) => r.text).join("");
        target.author = new BaseChannel_1.BaseChannel({
            id: authorExternalChannelId,
            name: authorName.simpleText,
            thumbnails: authorPhoto.thumbnails,
            client: target.client,
        });
        target.timestamp = +timestampUsec;
        return target;
    }
}
exports.ChatParser = ChatParser;
