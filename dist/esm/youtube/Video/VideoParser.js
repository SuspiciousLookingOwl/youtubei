var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
import { getContinuationFromItems, Thumbnails } from "../../common";
import { BaseVideoParser } from "../BaseVideo";
import { Comment } from "../Comment";
var VideoParser = /** @class */ (function () {
    function VideoParser() {
    }
    VideoParser.loadVideo = function (target, data) {
        var _a, _b, _c;
        var videoInfo = BaseVideoParser.parseRawData(data);
        target.duration = +videoInfo.videoDetails.lengthSeconds;
        var itemSectionRenderer = (_a = data.response.contents.twoColumnWatchNextResults.results.results.contents
            .reverse()
            .find(function (c) { return c.itemSectionRenderer; })) === null || _a === void 0 ? void 0 : _a.itemSectionRenderer;
        target.comments.continuation = getContinuationFromItems((itemSectionRenderer === null || itemSectionRenderer === void 0 ? void 0 : itemSectionRenderer.contents) || []);
        var chapters = (_c = (_b = data.response.playerOverlays.playerOverlayRenderer.decoratedPlayerBarRenderer) === null || _b === void 0 ? void 0 : _b.decoratedPlayerBarRenderer.playerBar.multiMarkersPlayerBarRenderer.markersMap) === null || _c === void 0 ? void 0 : _c[0].value.chapters;
        target.chapters =
            (chapters === null || chapters === void 0 ? void 0 : chapters.map(function (_a) {
                var c = _a.chapterRenderer;
                return ({
                    title: c.title.simpleText,
                    start: c.timeRangeStartMillis,
                    thumbnails: new Thumbnails().load(c.thumbnail.thumbnails),
                });
            })) || [];
        return target;
    };
    VideoParser.parseComments = function (data, video) {
        var endpoints = data.onResponseReceivedEndpoints.find(function (c) {
            var _a;
            return (c.appendContinuationItemsAction ||
                ((_a = c.reloadContinuationItemsCommand) === null || _a === void 0 ? void 0 : _a.slot) === "RELOAD_CONTINUATION_SLOT_BODY");
        });
        var repliesContinuationItems = (endpoints.reloadContinuationItemsCommand || endpoints.appendContinuationItemsAction).continuationItems;
        var comments = data.frameworkUpdates.entityBatchUpdate.mutations
            .filter(function (m) { return m.payload.commentEntityPayload; })
            .map(function (m) {
            var _a;
            var repliesItems = (_a = repliesContinuationItems.find(function (r) {
                return r.commentThreadRenderer.commentViewModel.commentKey === m.key;
            })) === null || _a === void 0 ? void 0 : _a.commentThreadRenderer;
            return __assign(__assign({}, m.payload.commentEntityPayload), repliesItems);
        });
        return comments.map(function (c) {
            return new Comment({ video: video, client: video.client }).load(c);
        });
    };
    VideoParser.parseCommentContinuation = function (data) {
        var endpoints = data.onResponseReceivedEndpoints.at(-1);
        var continuationItems = (endpoints.reloadContinuationItemsCommand || endpoints.appendContinuationItemsAction).continuationItems;
        return getContinuationFromItems(continuationItems);
    };
    return VideoParser;
}());
export { VideoParser };
