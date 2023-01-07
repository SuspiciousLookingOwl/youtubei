var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
import { Base } from "../Base";
import { CommentParser } from "./CommentParser";
import { CommentReplies } from "./CommentReplies";
/** Represents a Comment / Reply */
var Comment = /** @class */ (function (_super) {
    __extends(Comment, _super);
    /** @hidden */
    function Comment(attr) {
        var _this = _super.call(this, attr.client) || this;
        Object.assign(_this, attr);
        _this.replies = new CommentReplies({ client: attr.client, comment: _this });
        return _this;
    }
    /**
     * Load this instance with raw data from Youtube
     *
     * @hidden
     */
    Comment.prototype.load = function (data) {
        CommentParser.loadComment(this, data);
        return this;
    };
    Object.defineProperty(Comment.prototype, "url", {
        /** URL to the video with this comment being highlighted (appears on top of the comment section) */
        get: function () {
            return "https://www.youtube.com/watch?v=" + this.video.id + "&lc=" + this.id;
        },
        enumerable: false,
        configurable: true
    });
    return Comment;
}(Base));
export { Comment };
