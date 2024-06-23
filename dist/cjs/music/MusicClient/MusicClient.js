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
exports.MusicClient = void 0;
const common_1 = require("../../common");
const MusicLyrics_1 = require("../MusicLyrics");
const MusicSearchResult_1 = require("../MusicSearchResult");
const constants_1 = require("../constants");
/** Youtube Music Client */
class MusicClient {
    constructor(options = {}) {
        const fullOptions = Object.assign(Object.assign({ initialCookie: "", fetchOptions: {} }, options), { youtubeClientOptions: Object.assign({ hl: "en", gl: "US" }, options.youtubeClientOptions) });
        this.http = new common_1.HTTP(Object.assign({ apiKey: constants_1.INNERTUBE_API_KEY, baseUrl: constants_1.BASE_URL, clientName: "WEB_REMIX", clientVersion: constants_1.INNERTUBE_CLIENT_VERSION }, fullOptions));
    }
    search(query, type) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!type) {
                const response = yield this.http.post(`${constants_1.I_END_POINT}/search`, {
                    data: { query },
                });
                return MusicSearchResult_1.MusicAllSearchResultParser.parseSearchResult(response.data, this);
            }
            else {
                const result = new MusicSearchResult_1.MusicSearchResult({ client: this });
                yield result.search(query, type);
                return result;
            }
        });
    }
    /**
     * Searches for all video, song, album, playlist, or artist
     *
     * @param query The search query
     */
    searchAll(query) {
        return __awaiter(this, void 0, void 0, function* () {
            const response = yield this.http.post(`${constants_1.I_END_POINT}/search`, {
                data: { query },
            });
            return {
                top: MusicSearchResult_1.MusicAllSearchResultParser.parseTopResult(response.data, this),
                shelves: MusicSearchResult_1.MusicAllSearchResultParser.parseSearchResult(response.data, this),
            };
        });
    }
    /**
     * Get lyrics of a song
     *
     * @param query The search query
     * @param options Search options
     *
     */
    getLyrics(id) {
        return __awaiter(this, void 0, void 0, function* () {
            // get watch page data to obtain lyric browse id
            const watchResponse = yield this.http.post(`${constants_1.I_END_POINT}/next`, {
                data: { videoId: id },
            });
            const lyricTab = watchResponse.data.contents.singleColumnMusicWatchNextResultsRenderer.tabbedRenderer
                .watchNextTabbedResultsRenderer.tabs[1].tabRenderer;
            if (lyricTab.unselectable)
                return undefined;
            // get lyric data with browse id
            const lyricsBrowseId = lyricTab.endpoint.browseEndpoint.browseId;
            const lyricResponse = yield this.http.post(`${constants_1.I_END_POINT}/browse`, {
                data: { browseId: lyricsBrowseId },
            });
            const data = lyricResponse.data.contents.sectionListRenderer.contents[0]
                .musicDescriptionShelfRenderer;
            const content = data.description.runs[0].text;
            const description = data.footer.runs[0].text;
            return new MusicLyrics_1.MusicLyrics({
                content,
                description,
            });
        });
    }
}
exports.MusicClient = MusicClient;
