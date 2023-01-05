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
var __read = (this && this.__read) || function (o, n) {
    var m = typeof Symbol === "function" && o[Symbol.iterator];
    if (!m) return o;
    var i = m.call(o), r, ar = [], e;
    try {
        while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
    }
    catch (error) { e = { error: error }; }
    finally {
        try {
            if (r && !r.done && (m = i["return"])) m.call(i);
        }
        finally { if (e) throw e.error; }
    }
    return ar;
};
var __spread = (this && this.__spread) || function () {
    for (var ar = [], i = 0; i < arguments.length; i++) ar = ar.concat(__read(arguments[i]));
    return ar;
};
import { Continuable } from "../Continuable";
import { I_END_POINT } from "../constants";
import { SearchResultParser } from "./SearchResultParser";
import { optionsToProto, SearchProto } from "./proto";
export var SearchEnum;
(function (SearchEnum) {
    var UploadDate;
    (function (UploadDate) {
        UploadDate["All"] = "all";
        UploadDate["Hour"] = "hour";
        UploadDate["Today"] = "today";
        UploadDate["Week"] = "week";
        UploadDate["Month"] = "month";
        UploadDate["Year"] = "year";
    })(UploadDate = SearchEnum.UploadDate || (SearchEnum.UploadDate = {}));
    var Type;
    (function (Type) {
        Type["Video"] = "video";
        Type["Playlist"] = "playlist";
        Type["Channel"] = "channel";
        Type["All"] = "all";
    })(Type = SearchEnum.Type || (SearchEnum.Type = {}));
    var Duration;
    (function (Duration) {
        Duration["All"] = "all";
        Duration["Short"] = "short";
        Duration["Medium"] = "medium";
        Duration["Long"] = "long";
    })(Duration = SearchEnum.Duration || (SearchEnum.Duration = {}));
    var Sort;
    (function (Sort) {
        Sort["Relevance"] = "relevance";
        Sort["Rating"] = "rating";
        Sort["Date"] = "date";
        Sort["View"] = "view";
    })(Sort = SearchEnum.Sort || (SearchEnum.Sort = {}));
    var Feature;
    (function (Feature) {
        Feature["Live"] = "live";
        Feature["4K"] = "4k";
        Feature["UHD"] = "4k";
        Feature["HD"] = "hd";
        Feature["Subtitles"] = "subtitles";
        Feature["CreativeCommons"] = "creativeCommons";
        Feature["Spherical"] = "360";
        Feature["VR180"] = "vr180";
        Feature["3D"] = "3d";
        Feature["ThreeDimensions"] = "3d";
        Feature["HDR"] = "hdr";
        Feature["Location"] = "location";
    })(Feature = SearchEnum.Feature || (SearchEnum.Feature = {}));
})(SearchEnum || (SearchEnum = {}));
/**
 * Represents search result, usually returned from `client.search();`.
 *
 * {@link SearchResult} is a helper class to manage search result
 *
 * @example
 * ```ts
 * const result = await youtube.search("Keyword");
 *
 * console.log(result.items); // search result from first page
 *
 * let nextSearchResult = await result.next();
 * console.log(nextSearchResult); // search result from second page
 *
 * nextSearchResult = await result.next();
 * console.log(nextSearchResult); // search result from third page
 *
 * console.log(result.items); // search result from first, second, and third page.
 * ```
 *
 * @noInheritDoc
 */
var SearchResult = /** @class */ (function (_super) {
    __extends(SearchResult, _super);
    /** @hidden */
    function SearchResult(_a) {
        var client = _a.client;
        return _super.call(this, { client: client }) || this;
    }
    /**
     * Initialize data from search
     *
     * @param query Search query
     * @param options Search Options
     *
     * @hidden
     */
    SearchResult.prototype.search = function (query, options) {
        return __awaiter(this, void 0, void 0, function () {
            var bufferParams, response, _a, data, continuation;
            var _b;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        this.items = [];
                        this.estimatedResults = 0;
                        bufferParams = SearchProto.SearchOptions.encode(optionsToProto(options));
                        return [4 /*yield*/, this.client.http.post(I_END_POINT + "/search", {
                                data: {
                                    query: query,
                                    params: Buffer.from(bufferParams).toString("base64"),
                                },
                            })];
                    case 1:
                        response = _c.sent();
                        this.estimatedResults = +response.data.estimatedResults;
                        if (this.estimatedResults > 0) {
                            _a = SearchResultParser.parseInitialSearchResult(response.data, this.client), data = _a.data, continuation = _a.continuation;
                            (_b = this.items).push.apply(_b, __spread(data));
                            this.continuation = continuation;
                        }
                        return [2 /*return*/, this];
                }
            });
        });
    };
    SearchResult.prototype.fetch = function () {
        return __awaiter(this, void 0, void 0, function () {
            var response, _a, data, continuation;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, this.client.http.post(I_END_POINT + "/search", {
                            data: { continuation: this.continuation },
                        })];
                    case 1:
                        response = _b.sent();
                        _a = SearchResultParser.parseContinuationSearchResult(response.data, this.client), data = _a.data, continuation = _a.continuation;
                        return [2 /*return*/, {
                                items: data,
                                continuation: continuation,
                            }];
                }
            });
        });
    };
    return SearchResult;
}(Continuable));
export { SearchResult };
