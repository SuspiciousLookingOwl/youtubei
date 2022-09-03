"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Reply = void 0;
const Base_1 = require("../Base");
const ReplyParser_1 = require("./ReplyParser");
/** Represents a Reply */
class Reply extends Base_1.Base {
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
        ReplyParser_1.ReplyParser.loadReply(this, data);
        return this;
    }
}
exports.Reply = Reply;
