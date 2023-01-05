import { stripToInt, Thumbnails } from "../../common";
var BaseChannelParser = /** @class */ (function () {
    function BaseChannelParser() {
    }
    BaseChannelParser.loadBaseChannel = function (target, data) {
        var _a;
        var channelId = data.channelId, title = data.title, thumbnail = data.thumbnail, videoCountText = data.videoCountText, subscriberCountText = data.subscriberCountText;
        target.id = channelId;
        target.name = title.simpleText;
        target.thumbnails = new Thumbnails().load(thumbnail.thumbnails);
        target.videoCount = stripToInt((_a = videoCountText === null || videoCountText === void 0 ? void 0 : videoCountText.runs) === null || _a === void 0 ? void 0 : _a[0].text) || 0; // TODO this sometimes contains subscriber count for some reason
        target.subscriberCount = subscriberCountText === null || subscriberCountText === void 0 ? void 0 : subscriberCountText.simpleText;
        return target;
    };
    /** Parse tab data from request, tab name is ignored if it's a continuation data */
    BaseChannelParser.parseTabData = function (name, data) {
        var _a, _b, _c, _d;
        var tab = (_a = data.contents) === null || _a === void 0 ? void 0 : _a.twoColumnBrowseResultsRenderer.tabs.find(function (t) {
            var _a;
            return (((_a = t.tabRenderer) === null || _a === void 0 ? void 0 : _a.endpoint.browseEndpoint.params) ===
                BaseChannelParser.TAB_TYPE_PARAMS[name]);
        });
        return (((_c = (_b = tab === null || tab === void 0 ? void 0 : tab.tabRenderer.content.sectionListRenderer.contents) === null || _b === void 0 ? void 0 : _b[0].itemSectionRenderer.contents[0].gridRenderer) === null || _c === void 0 ? void 0 : _c.items) || (tab === null || tab === void 0 ? void 0 : tab.tabRenderer.content.richGridRenderer.contents.map(function (c) { var _a; return ((_a = c.richItemRenderer) === null || _a === void 0 ? void 0 : _a.content) || c; })) || ((_d = data.onResponseReceivedActions) === null || _d === void 0 ? void 0 : _d[0].appendContinuationItemsAction.continuationItems.map(function (c) { var _a; return ((_a = c.richItemRenderer) === null || _a === void 0 ? void 0 : _a.content) || c; })) ||
            []);
    };
    BaseChannelParser.TAB_TYPE_PARAMS = {
        videos: "EgZ2aWRlb3M%3D",
        playlists: "EglwbGF5bGlzdHM%3D",
    };
    return BaseChannelParser;
}());
export { BaseChannelParser };
