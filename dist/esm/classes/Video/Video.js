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
import { BaseVideo } from "../BaseVideo";
import { VideoComments } from "./VideoComments";
import { VideoParser } from "./VideoParser";
/** Represents a Video, usually returned from `client.getVideo()`  */
var Video = /** @class */ (function (_super) {
    __extends(Video, _super);
    /** @hidden */
    function Video(attr) {
        var _this = _super.call(this, attr) || this;
        Object.assign(_this, attr);
        _this.comments = new VideoComments({ client: attr.client, video: _this });
        return _this;
    }
    /**
     * Load this instance with raw data from Youtube
     *
     * @hidden
     */
    Video.prototype.load = function (data) {
        _super.prototype.load.call(this, data);
        VideoParser.loadVideo(this, data);
        return this;
    };
    return Video;
}(BaseVideo));
export { Video };
