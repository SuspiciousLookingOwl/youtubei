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
import { PostParser } from "./PostParser";
/** Represents a chat in a live stream */
var Post = /** @class */ (function (_super) {
    __extends(Post, _super);
    /** @hidden */
    function Post(attr) {
        var _this = _super.call(this, attr.client) || this;
        Object.assign(_this, attr);
        return _this;
    }
    /**
     * Load this instance with raw data from Youtube
     *
     * @hidden
     */
    Post.prototype.load = function (data) {
        PostParser.loadPost(this, data);
        return this;
    };
    return Post;
}(Base));
export { Post };
