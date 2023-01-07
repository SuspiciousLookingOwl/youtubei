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
import { MusicBase } from "../MusicBase";
var MusicBaseAlbum = /** @class */ (function (_super) {
    __extends(MusicBaseAlbum, _super);
    /** @hidden */
    function MusicBaseAlbum(attr) {
        var _this = _super.call(this, attr.client) || this;
        Object.assign(_this, attr);
        return _this;
    }
    return MusicBaseAlbum;
}(MusicBase));
export { MusicBaseAlbum };
