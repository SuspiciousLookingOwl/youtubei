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
import { BaseVideoParser } from "./BaseVideoParser";
import { VideoRelated } from "./VideoRelated";
/** Represents a Video  */
var BaseVideo = /** @class */ (function (_super) {
    __extends(BaseVideo, _super);
    /** @hidden */
    function BaseVideo(attr) {
        var _this = _super.call(this, attr.client) || this;
        Object.assign(_this, attr);
        _this.related = new VideoRelated({ client: _this.client, video: _this });
        return _this;
    }
    /**
     * Load this instance with raw data from Youtube
     *
     * @hidden
     */
    BaseVideo.prototype.load = function (data) {
        BaseVideoParser.loadBaseVideo(this, data);
        return this;
    };
    Object.defineProperty(BaseVideo.prototype, "upNext", {
        /**
         * Video / playlist to play next after this video, alias to
         * ```js
         * video.related.items[0]
         * ```
         */
        get: function () {
            return this.related.items[0];
        },
        enumerable: false,
        configurable: true
    });
    return BaseVideo;
}(Base));
export { BaseVideo };
