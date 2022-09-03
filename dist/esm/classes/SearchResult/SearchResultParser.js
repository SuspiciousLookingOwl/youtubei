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
import { getContinuationFromItems } from "../../common";
import { BaseChannel } from "../BaseChannel";
import { PlaylistCompact } from "../PlaylistCompact";
import { VideoCompact } from "../VideoCompact";
var SearchResultParser = /** @class */ (function () {
    function SearchResultParser() {
    }
    SearchResultParser.parseInitialSearchResult = function (data, client) {
        var sectionListContents = data.contents.twoColumnSearchResultsRenderer.primaryContents.sectionListRenderer
            .contents;
        return {
            data: SearchResultParser.parseSearchResult(sectionListContents, client),
            continuation: getContinuationFromItems(sectionListContents),
        };
    };
    SearchResultParser.parseContinuationSearchResult = function (data, client) {
        var sectionListContents = data.onResponseReceivedCommands[0].appendContinuationItemsAction.continuationItems;
        return {
            data: SearchResultParser.parseSearchResult(sectionListContents, client),
            continuation: getContinuationFromItems(sectionListContents),
        };
    };
    SearchResultParser.parseSearchResult = function (sectionListContents, client) {
        var e_1, _a;
        var rawContents = sectionListContents
            .filter(function (c) { return "itemSectionRenderer" in c; })
            .at(-1).itemSectionRenderer.contents;
        var contents = [];
        try {
            for (var rawContents_1 = __values(rawContents), rawContents_1_1 = rawContents_1.next(); !rawContents_1_1.done; rawContents_1_1 = rawContents_1.next()) {
                var c = rawContents_1_1.value;
                if ("playlistRenderer" in c)
                    contents.push(new PlaylistCompact({ client: client }).load(c.playlistRenderer));
                else if ("videoRenderer" in c)
                    contents.push(new VideoCompact({ client: client }).load(c.videoRenderer));
                else if ("channelRenderer" in c)
                    contents.push(new BaseChannel({ client: client }).load(c.channelRenderer));
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
    return SearchResultParser;
}());
export { SearchResultParser };
