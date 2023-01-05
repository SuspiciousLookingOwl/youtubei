"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SearchResult = exports.SearchEnum = void 0;
const Continuable_1 = require("../Continuable");
const constants_1 = require("../constants");
const SearchResultParser_1 = require("./SearchResultParser");
const proto_1 = require("./proto");
var SearchEnum;
(function (SearchEnum) {
    let UploadDate;
    (function (UploadDate) {
        UploadDate["All"] = "all";
        UploadDate["Hour"] = "hour";
        UploadDate["Today"] = "today";
        UploadDate["Week"] = "week";
        UploadDate["Month"] = "month";
        UploadDate["Year"] = "year";
    })(UploadDate = SearchEnum.UploadDate || (SearchEnum.UploadDate = {}));
    let Type;
    (function (Type) {
        Type["Video"] = "video";
        Type["Playlist"] = "playlist";
        Type["Channel"] = "channel";
        Type["All"] = "all";
    })(Type = SearchEnum.Type || (SearchEnum.Type = {}));
    let Duration;
    (function (Duration) {
        Duration["All"] = "all";
        Duration["Short"] = "short";
        Duration["Medium"] = "medium";
        Duration["Long"] = "long";
    })(Duration = SearchEnum.Duration || (SearchEnum.Duration = {}));
    let Sort;
    (function (Sort) {
        Sort["Relevance"] = "relevance";
        Sort["Rating"] = "rating";
        Sort["Date"] = "date";
        Sort["View"] = "view";
    })(Sort = SearchEnum.Sort || (SearchEnum.Sort = {}));
    let Feature;
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
})(SearchEnum = exports.SearchEnum || (exports.SearchEnum = {}));
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
class SearchResult extends Continuable_1.Continuable {
    /** @hidden */
    constructor({ client }) {
        super({ client });
    }
    /**
     * Initialize data from search
     *
     * @param query Search query
     * @param options Search Options
     *
     * @hidden
     */
    search(query, options) {
        return __awaiter(this, void 0, void 0, function* () {
            this.items = [];
            this.estimatedResults = 0;
            const bufferParams = proto_1.SearchProto.SearchOptions.encode(proto_1.optionsToProto(options));
            const response = yield this.client.http.post(`${constants_1.I_END_POINT}/search`, {
                data: {
                    query,
                    params: Buffer.from(bufferParams).toString("base64"),
                },
            });
            this.estimatedResults = +response.data.estimatedResults;
            if (this.estimatedResults > 0) {
                const { data, continuation } = SearchResultParser_1.SearchResultParser.parseInitialSearchResult(response.data, this.client);
                this.items.push(...data);
                this.continuation = continuation;
            }
            return this;
        });
    }
    fetch() {
        return __awaiter(this, void 0, void 0, function* () {
            const response = yield this.client.http.post(`${constants_1.I_END_POINT}/search`, {
                data: { continuation: this.continuation },
            });
            const { data, continuation } = SearchResultParser_1.SearchResultParser.parseContinuationSearchResult(response.data, this.client);
            return {
                items: data,
                continuation,
            };
        });
    }
}
exports.SearchResult = SearchResult;
