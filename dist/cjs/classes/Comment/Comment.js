"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Comment = void 0;
const Base_1 = require("../Base");
const CommentParser_1 = require("./CommentParser");
const CommentReplies_1 = require("./CommentReplies");
/** Represents a Comment / Reply */
class Comment extends Base_1.Base {
    /** @hidden */
    constructor(attr) {
        super(attr.client);
        Object.assign(this, attr);
        this.replies = new CommentReplies_1.CommentReplies({ client: attr.client, comment: this });
    }
    /**
     * Load this instance with raw data from Youtube
     *
     * @hidden
     */
    load(data) {
        CommentParser_1.CommentParser.loadComment(this, data);
        return this;
    }
    /** URL to the video with this comment being highlighted (appears on top of the comment section) */
    get url() {
        return `https://www.youtube.com/watch?v=${this.video.id}&lc=${this.id}`;
    }
}
exports.Comment = Comment;
