import { getContinuationFromItems, mapFilter, Thumbnails } from "../../common";
import { BaseVideoParser } from "../BaseVideo";
import { Comment } from "../Comment";
var VideoParser = /** @class */ (function () {
    function VideoParser() {
    }
    VideoParser.loadVideo = function (target, data) {
        var _a, _b, _c;
        var videoInfo = BaseVideoParser.parseRawData(data);
        target.duration = +videoInfo.videoDetails.lengthSeconds;
        var itemSectionRenderer = (_a = data[3].response.contents.twoColumnWatchNextResults.results.results.contents
            .reverse()
            .find(function (c) { return c.itemSectionRenderer; })) === null || _a === void 0 ? void 0 : _a.itemSectionRenderer;
        target.comments.continuation = getContinuationFromItems((itemSectionRenderer === null || itemSectionRenderer === void 0 ? void 0 : itemSectionRenderer.contents) || []);
        var chapters = (_c = (_b = data[3].response.playerOverlays.playerOverlayRenderer.decoratedPlayerBarRenderer) === null || _b === void 0 ? void 0 : _b.decoratedPlayerBarRenderer.playerBar.multiMarkersPlayerBarRenderer.markersMap) === null || _c === void 0 ? void 0 : _c[0].value.chapters;
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
        var endpoints = data.onResponseReceivedEndpoints.at(-1);
        var continuationItems = (endpoints.reloadContinuationItemsCommand || endpoints.appendContinuationItemsAction).continuationItems;
        var comments = mapFilter(continuationItems, "commentThreadRenderer");
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
