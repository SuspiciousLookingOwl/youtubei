"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BaseChannelParser = void 0;
const common_1 = require("../../common");
const Thumbnails_1 = require("../Thumbnails");
class BaseChannelParser {
    static loadBaseChannel(target, data) {
        const { channelId, title, thumbnail, videoCountText, subscriberCountText } = data;
        target.id = channelId;
        target.name = title.simpleText;
        target.thumbnails = new Thumbnails_1.Thumbnails().load(thumbnail.thumbnails);
        target.videoCount = common_1.stripToInt(videoCountText === null || videoCountText === void 0 ? void 0 : videoCountText.runs[0].text) || 0;
        target.subscriberCount = subscriberCountText === null || subscriberCountText === void 0 ? void 0 : subscriberCountText.simpleText;
        return target;
    }
    /** Parse tab data from request, tab name is ignored if it's a continuation data */
    static parseTabData(name, data) {
        var _a, _b, _c;
        const tab = (_a = data.contents) === null || _a === void 0 ? void 0 : _a.twoColumnBrowseResultsRenderer.tabs.find((t) => {
            var _a;
            return (((_a = t.tabRenderer) === null || _a === void 0 ? void 0 : _a.endpoint.browseEndpoint.params) ===
                BaseChannelParser.TAB_TYPE_PARAMS[name]);
        });
        return (((_b = tab === null || tab === void 0 ? void 0 : tab.tabRenderer.content.sectionListRenderer.contents[0].itemSectionRenderer.contents[0].gridRenderer) === null || _b === void 0 ? void 0 : _b.items) || ((_c = data.onResponseReceivedActions) === null || _c === void 0 ? void 0 : _c[0].appendContinuationItemsAction.continuationItems) ||
            []);
    }
}
exports.BaseChannelParser = BaseChannelParser;
BaseChannelParser.TAB_TYPE_PARAMS = {
    videos: "EgZ2aWRlb3M%3D",
    playlists: "EglwbGF5bGlzdHM%3D",
};
