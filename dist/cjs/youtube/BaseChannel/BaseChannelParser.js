"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BaseChannelParser = void 0;
const common_1 = require("../../common");
class BaseChannelParser {
    static loadBaseChannel(target, data) {
        var _a;
        const { channelId, title, thumbnail, videoCountText, subscriberCountText } = data;
        target.id = channelId;
        target.name = title.simpleText;
        target.thumbnails = new common_1.Thumbnails().load(thumbnail.thumbnails);
        target.videoCount = common_1.stripToInt((_a = videoCountText === null || videoCountText === void 0 ? void 0 : videoCountText.runs) === null || _a === void 0 ? void 0 : _a[0].text) || 0; // TODO this sometimes contains subscriber count for some reason
        target.subscriberCount = subscriberCountText === null || subscriberCountText === void 0 ? void 0 : subscriberCountText.simpleText;
        return target;
    }
    /** Parse tab data from request, tab name is ignored if it's a continuation data */
    static parseTabData(name, data) {
        var _a, _b, _c, _d;
        const tab = (_a = data.contents) === null || _a === void 0 ? void 0 : _a.twoColumnBrowseResultsRenderer.tabs.find((t) => {
            var _a;
            return (((_a = t.tabRenderer) === null || _a === void 0 ? void 0 : _a.endpoint.browseEndpoint.params) ===
                BaseChannelParser.TAB_TYPE_PARAMS[name]);
        });
        return (((_c = (_b = tab === null || tab === void 0 ? void 0 : tab.tabRenderer.content.sectionListRenderer.contents) === null || _b === void 0 ? void 0 : _b[0].itemSectionRenderer.contents[0].gridRenderer) === null || _c === void 0 ? void 0 : _c.items) || (tab === null || tab === void 0 ? void 0 : tab.tabRenderer.content.richGridRenderer.contents.map((c) => { var _a; return ((_a = c.richItemRenderer) === null || _a === void 0 ? void 0 : _a.content) || c; })) || ((_d = data.onResponseReceivedActions) === null || _d === void 0 ? void 0 : _d[0].appendContinuationItemsAction.continuationItems.map((c) => { var _a; return ((_a = c.richItemRenderer) === null || _a === void 0 ? void 0 : _a.content) || c; })) ||
            []);
    }
}
exports.BaseChannelParser = BaseChannelParser;
BaseChannelParser.TAB_TYPE_PARAMS = {
    videos: "EgZ2aWRlb3M%3D",
    playlists: "EglwbGF5bGlzdHM%3D",
};
