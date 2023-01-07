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
import { PlaylistParser } from "./PlaylistParser";
import { PlaylistVideos } from "./PlaylistVideos";
/** Represents a Playlist, usually returned from `client.getPlaylist()` */
var Playlist = /** @class */ (function (_super) {
    __extends(Playlist, _super);
    /** @hidden */
    function Playlist(attr) {
        var _this = _super.call(this, attr.client) || this;
        Object.assign(_this, attr);
        _this.videos = new PlaylistVideos({ client: attr.client, playlist: _this });
        return _this;
    }
    /**
     * Load this instance with raw data from Youtube
     *
     * @hidden
     */
    Playlist.prototype.load = function (data) {
        PlaylistParser.loadPlaylist(this, data);
        return this;
    };
    return Playlist;
}(Base));
export { Playlist };
