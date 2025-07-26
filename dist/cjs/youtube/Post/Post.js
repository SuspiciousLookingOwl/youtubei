"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Post = void 0;
const Base_1 = require("../Base");
const PostParser_1 = require("./PostParser");
/** Represents a chat in a live stream */
class Post extends Base_1.Base {
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
        PostParser_1.PostParser.loadPost(this, data);
        return this;
    }
}
exports.Post = Post;
