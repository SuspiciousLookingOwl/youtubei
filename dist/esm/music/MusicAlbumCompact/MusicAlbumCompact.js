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
import { MusicBaseAlbum } from "../MusicBaseAlbum";
var MusicAlbumCompact = /** @class */ (function (_super) {
    __extends(MusicAlbumCompact, _super);
    /** @hidden */
    function MusicAlbumCompact(attr) {
        var _this = _super.call(this, attr) || this;
        Object.assign(_this, attr);
        return _this;
    }
    return MusicAlbumCompact;
}(MusicBaseAlbum));
export { MusicAlbumCompact };
