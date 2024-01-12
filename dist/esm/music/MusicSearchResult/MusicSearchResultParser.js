var __values = (this && this.__values) || function(o) {
    var s = typeof Symbol === "function" && Symbol.iterator, m = s && o[s], i = 0;
    if (m) return m.call(o);
    if (o && typeof o.length === "number") return {
        next: function () {
            if (o && i >= o.length) o = void 0;
            return { value: o && o[i++], done: !o };
        }
    };
    throw new TypeError(s ? "Object is not iterable." : "Symbol.iterator is not defined.");
};
import { MusicAllSearchResultParser } from "./MusicAllSearchResultParser";
var MusicSearchResultParser = /** @class */ (function () {
    function MusicSearchResultParser() {
    }
    MusicSearchResultParser.parseInitialSearchResult = function (data, type, client) {
        var _a, _b;
        var contentSection = data.contents.tabbedSearchResultsRenderer.tabs[0].tabRenderer.content.sectionListRenderer.contents.find(function (c) { return "musicShelfRenderer" in c; });
        if (!contentSection) {
            // no results
            return {
                data: [],
                continuation: undefined,
            };
        }
        var _c = contentSection.musicShelfRenderer, contents = _c.contents, continuations = _c.continuations;
        return {
            data: MusicSearchResultParser.parseSearchResult(contents, type, client),
            continuation: (_b = (_a = continuations === null || continuations === void 0 ? void 0 : continuations[0]) === null || _a === void 0 ? void 0 : _a.nextContinuationData) === null || _b === void 0 ? void 0 : _b.continuation,
        };
    };
    MusicSearchResultParser.parseContinuationSearchResult = function (data, type, client) {
        var shelf = data.continuationContents.musicShelfContinuation;
        return {
            data: MusicSearchResultParser.parseSearchResult(shelf.contents, type, client),
            continuation: shelf.continuations[0].nextContinuationData.continuation,
        };
    };
    MusicSearchResultParser.parseSearchResult = function (shelfContents, type, client) {
        var e_1, _a;
        var rawContents = shelfContents
            .filter(function (c) { return "musicResponsiveListItemRenderer" in c; })
            .map(function (c) { return c.musicResponsiveListItemRenderer; });
        var contents = [];
        try {
            for (var rawContents_1 = __values(rawContents), rawContents_1_1 = rawContents_1.next(); !rawContents_1_1.done; rawContents_1_1 = rawContents_1.next()) {
                var c = rawContents_1_1.value;
                var parsed = MusicAllSearchResultParser.parseVideoItem(c, type === "video" ? "MUSIC_VIDEO_TYPE_UGC" : "MUSIC_VIDEO_TYPE_ATV", client);
                if (parsed)
                    contents.push(parsed);
            }
        }
        catch (e_1_1) { e_1 = { error: e_1_1 }; }
        finally {
            try {
                if (rawContents_1_1 && !rawContents_1_1.done && (_a = rawContents_1.return)) _a.call(rawContents_1);
            }
            finally { if (e_1) throw e_1.error; }
        }
        return contents;
    };
    return MusicSearchResultParser;
}());
export { MusicSearchResultParser };
