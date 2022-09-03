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
import { BaseChannel } from "../BaseChannel";
import { ChannelParser } from "./ChannelParser";
/**  Represents a Youtube Channel */
var Channel = /** @class */ (function (_super) {
    __extends(Channel, _super);
    /** @hidden */
    function Channel(attr) {
        var _this = _super.call(this, attr) || this;
        _this.shelves = [];
        Object.assign(_this, attr);
        return _this;
    }
    /**
     * Load this instance with raw data from Youtube
     *
     * @hidden
     */
    Channel.prototype.load = function (data) {
        ChannelParser.loadChannel(this, data);
        return this;
    };
    return Channel;
}(BaseChannel));
export { Channel };
