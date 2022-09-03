"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Channel = void 0;
const BaseChannel_1 = require("../BaseChannel");
const ChannelParser_1 = require("./ChannelParser");
/**  Represents a Youtube Channel */
class Channel extends BaseChannel_1.BaseChannel {
    /** @hidden */
    constructor(attr) {
        super(attr);
        this.shelves = [];
        Object.assign(this, attr);
    }
    /**
     * Load this instance with raw data from Youtube
     *
     * @hidden
     */
    load(data) {
        ChannelParser_1.ChannelParser.loadChannel(this, data);
        return this;
    }
}
exports.Channel = Channel;
