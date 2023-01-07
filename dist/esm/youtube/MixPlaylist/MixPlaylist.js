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
import { MixPlaylistParser } from "./MixPlaylistParser";
/** Represents a MixPlaylist, usually returned from `client.getPlaylist()` */
var MixPlaylist = /** @class */ (function (_super) {
    __extends(MixPlaylist, _super);
    /** @hidden */
    function MixPlaylist(attr) {
        var _this = _super.call(this, attr.client) || this;
        /** How many viewers does this playlist have */
        _this.videos = [];
        Object.assign(_this, attr);
        return _this;
    }
    /**
     * Load this instance with raw data from Youtube
     *
     * @hidden
     */
    MixPlaylist.prototype.load = function (data) {
        MixPlaylistParser.loadMixPlaylist(this, data);
        return this;
    };
    return MixPlaylist;
}(Base));
export { MixPlaylist };
