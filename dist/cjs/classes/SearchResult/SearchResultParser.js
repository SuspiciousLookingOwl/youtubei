"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SearchResultParser = void 0;
const common_1 = require("../../common");
const BaseChannel_1 = require("../BaseChannel");
const PlaylistCompact_1 = require("../PlaylistCompact");
const VideoCompact_1 = require("../VideoCompact");
class SearchResultParser {
    static parseInitialSearchResult(data, client) {
        const sectionListContents = data.contents.twoColumnSearchResultsRenderer.primaryContents.sectionListRenderer
            .contents;
        return {
            data: SearchResultParser.parseSearchResult(sectionListContents, client),
            continuation: common_1.getContinuationFromItems(sectionListContents),
        };
    }
    static parseContinuationSearchResult(data, client) {
        const sectionListContents = data.onResponseReceivedCommands[0].appendContinuationItemsAction.continuationItems;
        return {
            data: SearchResultParser.parseSearchResult(sectionListContents, client),
            continuation: common_1.getContinuationFromItems(sectionListContents),
        };
    }
    static parseSearchResult(sectionListContents, client) {
        const rawContents = sectionListContents
            .filter((c) => "itemSectionRenderer" in c)
            .at(-1).itemSectionRenderer.contents;
        const contents = [];
        for (const c of rawContents) {
            if ("playlistRenderer" in c)
                contents.push(new PlaylistCompact_1.PlaylistCompact({ client }).load(c.playlistRenderer));
            else if ("videoRenderer" in c)
                contents.push(new VideoCompact_1.VideoCompact({ client }).load(c.videoRenderer));
            else if ("channelRenderer" in c)
                contents.push(new BaseChannel_1.BaseChannel({ client }).load(c.channelRenderer));
        }
        return contents;
    }
}
exports.SearchResultParser = SearchResultParser;
