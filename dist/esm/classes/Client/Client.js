var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
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
import { HTTP } from "../../common";
import { Channel } from "../Channel";
import { LiveVideo } from "../LiveVideo";
import { MixPlaylist } from "../MixPlaylist";
import { Playlist } from "../Playlist";
import { SearchResult } from "../SearchResult";
import { Transcript, TranscriptParamsProto } from "../Transcript";
import { Video } from "../Video";
import { BASE_URL, INNERTUBE_API_KEY, INNERTUBE_CLIENT_NAME, INNERTUBE_CLIENT_VERSION, I_END_POINT, WATCH_END_POINT, } from "../constants";
/** Youtube Client */
var Client = /** @class */ (function () {
    function Client(options) {
        if (options === void 0) { options = {}; }
        var fullOptions = __assign(__assign({ initialCookie: "", fetchOptions: {} }, options), { youtubeClientOptions: __assign({ hl: "en", gl: "US" }, options.youtubeClientOptions) });
        this.http = new HTTP(__assign({ apiKey: INNERTUBE_API_KEY, baseUrl: BASE_URL, clientName: INNERTUBE_CLIENT_NAME, clientVersion: INNERTUBE_CLIENT_VERSION }, fullOptions));
    }
    /**
     * Searches for videos / playlists / channels
     *
     * @param query The search query
     * @param options Search options
     *
     */
    Client.prototype.search = function (query, options) {
        return __awaiter(this, void 0, void 0, function () {
            var result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        result = new SearchResult({ client: this });
                        return [4 /*yield*/, result.search(query, options || {})];
                    case 1:
                        _a.sent();
                        return [2 /*return*/, result];
                }
            });
        });
    };
    /**
     * Search for videos / playlists / channels and returns the first result
     *
     * @return Can be {@link VideoCompact} | {@link PlaylistCompact} | {@link BaseChannel} | `undefined`
     */
    Client.prototype.findOne = function (query, options) {
        return __awaiter(this, void 0, void 0, function () {
            var result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.search(query, options)];
                    case 1:
                        result = _a.sent();
                        return [2 /*return*/, result.items[0] || undefined];
                }
            });
        });
    };
    /** Get playlist information and its videos by playlist id or URL */
    Client.prototype.getPlaylist = function (playlistId) {
        var _a, _b, _c;
        return __awaiter(this, void 0, void 0, function () {
            var response_1, response;
            return __generator(this, function (_d) {
                switch (_d.label) {
                    case 0:
                        if (!playlistId.startsWith("RD")) return [3 /*break*/, 2];
                        return [4 /*yield*/, this.http.post(I_END_POINT + "/next", {
                                data: { playlistId: playlistId },
                            })];
                    case 1:
                        response_1 = _d.sent();
                        if (response_1.data.error) {
                            return [2 /*return*/, undefined];
                        }
                        return [2 /*return*/, new MixPlaylist({ client: this }).load(response_1.data)];
                    case 2: return [4 /*yield*/, this.http.post(I_END_POINT + "/browse", {
                            data: { browseId: "VL" + playlistId },
                        })];
                    case 3:
                        response = _d.sent();
                        if (response.data.error || ((_c = (_b = (_a = response.data.alerts) === null || _a === void 0 ? void 0 : _a.shift()) === null || _b === void 0 ? void 0 : _b.alertRenderer) === null || _c === void 0 ? void 0 : _c.type) === "ERROR") {
                            return [2 /*return*/, undefined];
                        }
                        return [2 /*return*/, new Playlist({ client: this }).load(response.data)];
                }
            });
        });
    };
    /** Get video information by video id or URL */
    Client.prototype.getVideo = function (videoId) {
        return __awaiter(this, void 0, void 0, function () {
            var response;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.http.get("" + WATCH_END_POINT, {
                            params: { v: videoId, pbj: "1" },
                        })];
                    case 1:
                        response = _a.sent();
                        if (!response.data[3].response.contents)
                            return [2 /*return*/, undefined];
                        return [2 /*return*/, (!response.data[2].playerResponse.playabilityStatus.liveStreamability
                                ? new Video({ client: this }).load(response.data)
                                : new LiveVideo({ client: this }).load(response.data))];
                }
            });
        });
    };
    /** Get channel information by channel id+ */
    Client.prototype.getChannel = function (channelId) {
        var _a, _b, _c;
        return __awaiter(this, void 0, void 0, function () {
            var response;
            return __generator(this, function (_d) {
                switch (_d.label) {
                    case 0: return [4 /*yield*/, this.http.post(I_END_POINT + "/browse", {
                            data: { browseId: channelId },
                        })];
                    case 1:
                        response = _d.sent();
                        if (response.data.error || ((_c = (_b = (_a = response.data.alerts) === null || _a === void 0 ? void 0 : _a.shift()) === null || _b === void 0 ? void 0 : _b.alertRenderer) === null || _c === void 0 ? void 0 : _c.type) === "ERROR") {
                            return [2 /*return*/, undefined];
                        }
                        return [2 /*return*/, new Channel({ client: this }).load(response.data)];
                }
            });
        });
    };
    Client.prototype.getVideoTranscript = function (videoId) {
        return __awaiter(this, void 0, void 0, function () {
            var bufferParams, response;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        bufferParams = TranscriptParamsProto.TranscriptParams.encode({ videoId: videoId });
                        return [4 /*yield*/, this.http.post(I_END_POINT + "/get_transcript", {
                                data: { params: Buffer.from(bufferParams).toString("base64") },
                            })];
                    case 1:
                        response = _a.sent();
                        if (!response.data.actions)
                            return [2 /*return*/, undefined];
                        return [2 /*return*/, response.data.actions[0].updateEngagementPanelAction.content.transcriptRenderer.body.transcriptBodyRenderer.cueGroups
                                .map(function (t) { return t.transcriptCueGroupRenderer.cues[0].transcriptCueRenderer; })
                                .map(function (t) { return new Transcript().load(t); })];
                }
            });
        });
    };
    return Client;
}());
export { Client };
