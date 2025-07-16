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
import { getContinuationFromItems } from "../../common";
import { Continuable } from "../Continuable";
import { PlaylistCompact } from "../PlaylistCompact";
import { I_END_POINT } from "../constants";
import { BaseChannelParser } from "./BaseChannelParser";
/**
 * {@link Continuable} of playlists inside a {@link BaseChannel}
 *
 * @example
 * ```js
 * const channel = await youtube.findOne(CHANNEL_NAME, {type: "channel"});
 * await channel.playlists.next();
 * console.log(channel.playlists.items) // first 30 playlists
 *
 * let newPlaylists = await channel.playlists.next();
 * console.log(newPlaylists) // 30 loaded playlists
 * console.log(channel.playlists.items) // first 60 playlists
 *
 * await channel.playlists.next(0); // load the rest of the playlists in the channel
 * ```
 */
var ChannelPlaylists = /** @class */ (function (_super) {
    __extends(ChannelPlaylists, _super);
    /** @hidden */
    function ChannelPlaylists(_a) {
        var client = _a.client, channel = _a.channel;
        var _this = _super.call(this, { client: client, strictContinuationCheck: true }) || this;
        _this.channel = channel;
        return _this;
    }
    ChannelPlaylists.prototype.fetch = function () {
        var _a;
        return __awaiter(this, void 0, void 0, function () {
            var params, response, items, continuation, data;
            var _this = this;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        params = BaseChannelParser.TAB_TYPE_PARAMS.playlists;
                        return [4 /*yield*/, this.client.http.post(I_END_POINT + "/browse", {
                                data: { browseId: (_a = this.channel) === null || _a === void 0 ? void 0 : _a.id, params: params, continuation: this.continuation },
                            })];
                    case 1:
                        response = _b.sent();
                        items = BaseChannelParser.parseTabData("playlists", response.data);
                        continuation = getContinuationFromItems(items);
                        data = items.filter(function (i) { return "gridPlaylistRenderer" in i || "lockupViewModel" in i; });
                        return [2 /*return*/, {
                                continuation: continuation,
                                items: data.map(function (i) {
                                    var playlist = new PlaylistCompact({
                                        client: _this.client,
                                        channel: _this.channel,
                                    });
                                    if (i.gridPlaylistRenderer)
                                        playlist.load(i.gridPlaylistRenderer);
                                    else if (i.lockupViewModel)
                                        playlist.loadLockup(i.lockupViewModel);
                                    return playlist;
                                }),
                            }];
                }
            });
        });
    };
    return ChannelPlaylists;
}(Continuable));
export { ChannelPlaylists };
