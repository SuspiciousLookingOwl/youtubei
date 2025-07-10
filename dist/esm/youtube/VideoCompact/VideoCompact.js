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
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
import { Base } from "../Base";
import { VideoCompactParser } from "./VideoCompactParser";
/** Represent a compact video (e.g. from search result, playlist's videos, channel's videos) */
var VideoCompact = /** @class */ (function (_super) {
    __extends(VideoCompact, _super);
    /** @hidden */
    function VideoCompact(attr) {
        var _this = _super.call(this, attr.client) || this;
        Object.assign(_this, attr);
        return _this;
    }
    Object.defineProperty(VideoCompact.prototype, "isPrivateOrDeleted", {
        /** Whether this video is private / deleted or not, only useful in playlist's videos */
        get: function () {
            return !this.duration;
        },
        enumerable: false,
        configurable: true
    });
    /**
     * Load this instance with raw data from Youtube
     *
     * @hidden
     */
    VideoCompact.prototype.load = function (data) {
        VideoCompactParser.loadVideoCompact(this, data);
        return this;
    };
    /**
     * Load this instance with raw lockup data from Youtube
     *
     * @hidden
     */
    VideoCompact.prototype.loadLockup = function (data) {
        VideoCompactParser.loadLockupVideoCompact(this, data);
        return this;
    };
    /**
     * Get {@link Video} object based on current video id
     *
     * Equivalent to
     * ```js
     * client.getVideo(videoCompact.id);
     * ```
     */
    VideoCompact.prototype.getVideo = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.client.getVideo(this.id)];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    /**
     * Get Video transcript (if exists)
     *
     * Equivalent to
     * ```js
     * client.getVideoTranscript(video.id);
     * ```
     */
    VideoCompact.prototype.getTranscript = function (languageCode) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, this.client.getVideoTranscript(this.id, languageCode)];
            });
        });
    };
    return VideoCompact;
}(Base));
export { VideoCompact };
