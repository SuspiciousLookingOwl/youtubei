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
import { BaseChannelParser } from "./BaseChannelParser";
import { ChannelLive } from "./ChannelLive";
import { ChannelPlaylists } from "./ChannelPlaylists";
import { ChannelShorts } from "./ChannelShorts";
import { ChannelVideos } from "./ChannelVideos";
/**  Represents a Youtube Channel */
var BaseChannel = /** @class */ (function (_super) {
    __extends(BaseChannel, _super);
    /** @hidden */
    function BaseChannel(attr) {
        var _this = _super.call(this, attr.client) || this;
        Object.assign(_this, attr);
        _this.videos = new ChannelVideos({ channel: _this, client: _this.client });
        _this.shorts = new ChannelShorts({ channel: _this, client: _this.client });
        _this.live = new ChannelLive({ channel: _this, client: _this.client });
        _this.playlists = new ChannelPlaylists({ channel: _this, client: _this.client });
        return _this;
    }
    Object.defineProperty(BaseChannel.prototype, "url", {
        /** The URL of the channel page */
        get: function () {
            return "https://www.youtube.com/channel/" + this.id;
        },
        enumerable: false,
        configurable: true
    });
    /**
     * Load this instance with raw data from Youtube
     *
     * @hidden
     */
    BaseChannel.prototype.load = function (data) {
        BaseChannelParser.loadBaseChannel(this, data);
        return this;
    };
    return BaseChannel;
}(Base));
export { BaseChannel };
