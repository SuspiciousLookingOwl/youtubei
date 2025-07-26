import { Thumbnails } from "../../common";
var BaseChannelParser = /** @class */ (function () {
    function BaseChannelParser() {
    }
    BaseChannelParser.loadBaseChannel = function (target, data) {
        var channelId = data.channelId, title = data.title, thumbnail = data.thumbnail, subscriberCountText = data.subscriberCountText;
        target.id = channelId;
        target.name = title.simpleText;
        target.thumbnails = new Thumbnails().load(thumbnail.thumbnails);
        target.subscriberCount = subscriberCountText === null || subscriberCountText === void 0 ? void 0 : subscriberCountText.simpleText;
        return target;
    };
    /** Parse tab data from request, tab name is ignored if it's a continuation data */
    BaseChannelParser.parseTabData = function (name, data) {
        var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k;
        var tab = (_a = data.contents) === null || _a === void 0 ? void 0 : _a.twoColumnBrowseResultsRenderer.tabs.find(function (t) {
            var _a;
            return (((_a = t.tabRenderer) === null || _a === void 0 ? void 0 : _a.endpoint.browseEndpoint.params) ===
                BaseChannelParser.TAB_TYPE_PARAMS[name]);
        });
        return (((_d = (_c = (_b = tab === null || tab === void 0 ? void 0 : tab.tabRenderer.content.sectionListRenderer) === null || _b === void 0 ? void 0 : _b.contents) === null || _c === void 0 ? void 0 : _c[0].itemSectionRenderer.contents[0].gridRenderer) === null || _d === void 0 ? void 0 : _d.items) || ((_h = (_g = (_f = (_e = tab === null || tab === void 0 ? void 0 : tab.tabRenderer.content) === null || _e === void 0 ? void 0 : _e.sectionListRenderer) === null || _f === void 0 ? void 0 : _f.contents) === null || _g === void 0 ? void 0 : _g[0].itemSectionRenderer) === null || _h === void 0 ? void 0 : _h.contents) || (tab === null || tab === void 0 ? void 0 : tab.tabRenderer.content.richGridRenderer.contents.map(function (c) { var _a; return ((_a = c.richItemRenderer) === null || _a === void 0 ? void 0 : _a.content) || c; })) || ((_j = data.onResponseReceivedActions) === null || _j === void 0 ? void 0 : _j[0].appendContinuationItemsAction.continuationItems.map(function (c) { var _a; return ((_a = c.richItemRenderer) === null || _a === void 0 ? void 0 : _a.content) || c; })) || ((_k = data.onResponseReceivedEndpoints) === null || _k === void 0 ? void 0 : _k[0].appendContinuationItemsAction.continuationItems) ||
            []);
    };
    BaseChannelParser.TAB_TYPE_PARAMS = {
        videos: "EgZ2aWRlb3PyBgQKAjoA",
        shorts: "EgZzaG9ydHPyBgUKA5oBAA%3D%3D",
        live: "EgdzdHJlYW1z8gYECgJ6AA%3D%3D",
        playlists: "EglwbGF5bGlzdHPyBgQKAkIA",
        posts: "EgVwb3N0c_IGBAoCSgA%3D",
    };
    return BaseChannelParser;
}());
export { BaseChannelParser };
