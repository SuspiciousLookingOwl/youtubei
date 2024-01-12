"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MusicSearchResultParser = void 0;
const MusicAllSearchResultParser_1 = require("./MusicAllSearchResultParser");
class MusicSearchResultParser {
    static parseInitialSearchResult(data, type, client) {
        var _a, _b;
        const contentSection = data.contents.tabbedSearchResultsRenderer.tabs[0].tabRenderer.content.sectionListRenderer.contents.find((c) => "musicShelfRenderer" in c);
        if (!contentSection) {
            // no results
            return {
                data: [],
                continuation: undefined,
            };
        }
        const { contents, continuations } = contentSection.musicShelfRenderer;
        return {
            data: MusicSearchResultParser.parseSearchResult(contents, type, client),
            continuation: (_b = (_a = continuations === null || continuations === void 0 ? void 0 : continuations[0]) === null || _a === void 0 ? void 0 : _a.nextContinuationData) === null || _b === void 0 ? void 0 : _b.continuation,
        };
    }
    static parseContinuationSearchResult(data, type, client) {
        const shelf = data.continuationContents.musicShelfContinuation;
        return {
            data: MusicSearchResultParser.parseSearchResult(shelf.contents, type, client),
            continuation: shelf.continuations[0].nextContinuationData.continuation,
        };
    }
    static parseSearchResult(shelfContents, type, client) {
        const rawContents = shelfContents
            .filter((c) => "musicResponsiveListItemRenderer" in c)
            .map((c) => c.musicResponsiveListItemRenderer);
        const contents = [];
        for (const c of rawContents) {
            const parsed = MusicAllSearchResultParser_1.MusicAllSearchResultParser.parseVideoItem(c, type === "video" ? "MUSIC_VIDEO_TYPE_UGC" : "MUSIC_VIDEO_TYPE_ATV", client);
            if (parsed)
                contents.push(parsed);
        }
        return contents;
    }
}
exports.MusicSearchResultParser = MusicSearchResultParser;
