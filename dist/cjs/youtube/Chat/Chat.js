"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Chat = void 0;
const Base_1 = require("../Base");
const ChatParser_1 = require("./ChatParser");
/** Represents a chat in a live stream */
class Chat extends Base_1.Base {
    /** @hidden */
    constructor(attr) {
        super(attr.client);
        Object.assign(this, attr);
    }
    /**
     * Load this instance with raw data from Youtube
     *
     * @hidden
     */
    load(data) {
        ChatParser_1.ChatParser.loadChat(this, data);
        return this;
    }
}
exports.Chat = Chat;
