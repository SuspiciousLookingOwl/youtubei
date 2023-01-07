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
import { MusicLyrics } from "../MusicLyrics";
import { BASE_URL, INNERTUBE_API_KEY, INNERTUBE_CLIENT_VERSION, I_END_POINT } from "../constants";
import { MusicSearchResultParser } from "./MusicSearchResultParser";
/** Youtube Music Client */
var MusicClient = /** @class */ (function () {
    function MusicClient(options) {
        if (options === void 0) { options = {}; }
        var fullOptions = __assign(__assign({ initialCookie: "", fetchOptions: {} }, options), { youtubeClientOptions: __assign({ hl: "en", gl: "US" }, options.youtubeClientOptions) });
        this.http = new HTTP(__assign({ apiKey: INNERTUBE_API_KEY, baseUrl: BASE_URL, clientName: "WEB_REMIX", clientVersion: INNERTUBE_CLIENT_VERSION }, fullOptions));
    }
    /**
     * Searches for video, song, album, playlist, or artist
     *
     * @param query The search query
     * @param options Search options
     *
     */
    MusicClient.prototype.search = function (query) {
        return __awaiter(this, void 0, void 0, function () {
            var response;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.http.post(I_END_POINT + "/search", {
                            data: { query: query },
                        })];
                    case 1:
                        response = _a.sent();
                        return [2 /*return*/, MusicSearchResultParser.parseSearchResult(response.data, this)];
                }
            });
        });
    };
    /**
     * Get lyrics of a song
     *
     * @param query The search query
     * @param options Search options
     *
     */
    MusicClient.prototype.getLyrics = function (id) {
        return __awaiter(this, void 0, void 0, function () {
            var watchResponse, lyricTab, lyricsBrowseId, lyricResponse, data, content, description;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.http.post(I_END_POINT + "/next", {
                            data: { videoId: id },
                        })];
                    case 1:
                        watchResponse = _a.sent();
                        lyricTab = watchResponse.data.contents.singleColumnMusicWatchNextResultsRenderer.tabbedRenderer
                            .watchNextTabbedResultsRenderer.tabs[1].tabRenderer;
                        if (lyricTab.unselectable)
                            return [2 /*return*/, undefined];
                        lyricsBrowseId = lyricTab.endpoint.browseEndpoint.browseId;
                        return [4 /*yield*/, this.http.post(I_END_POINT + "/browse", {
                                data: { browseId: lyricsBrowseId },
                            })];
                    case 2:
                        lyricResponse = _a.sent();
                        data = lyricResponse.data.contents.sectionListRenderer.contents[0]
                            .musicDescriptionShelfRenderer;
                        content = data.description.runs[0].text;
                        description = data.footer.runs[0].text;
                        return [2 /*return*/, new MusicLyrics({
                                content: content,
                                description: description,
                            })];
                }
            });
        });
    };
    return MusicClient;
}());
export { MusicClient };
