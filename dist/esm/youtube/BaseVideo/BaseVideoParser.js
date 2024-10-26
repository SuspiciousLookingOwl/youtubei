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
import { getContinuationFromItems, stripToInt, Thumbnails } from "../../common";
import { BaseChannel } from "../BaseChannel";
import { PlaylistCompact } from "../PlaylistCompact";
import { VideoCompact } from "../VideoCompact";
import { VideoCaptions } from "./VideoCaptions";
var BaseVideoParser = /** @class */ (function () {
    function BaseVideoParser() {
    }
    BaseVideoParser.loadBaseVideo = function (target, data) {
        var _a, _b, _c;
        var videoInfo = BaseVideoParser.parseRawData(data);
        // Basic information
        target.id = videoInfo.videoDetails.videoId;
        target.title = videoInfo.videoDetails.title;
        target.uploadDate = videoInfo.dateText.simpleText;
        target.viewCount = +videoInfo.videoDetails.viewCount || null;
        target.isLiveContent = videoInfo.videoDetails.isLiveContent;
        target.thumbnails = new Thumbnails().load(videoInfo.videoDetails.thumbnail.thumbnails);
        // Channel
        var _d = videoInfo.owner.videoOwnerRenderer, title = _d.title, thumbnail = _d.thumbnail, subscriberCountText = _d.subscriberCountText;
        target.channel = new BaseChannel({
            client: target.client,
            id: title.runs[0].navigationEndpoint.browseEndpoint.browseId,
            name: title.runs[0].text,
            subscriberCount: subscriberCountText === null || subscriberCountText === void 0 ? void 0 : subscriberCountText.simpleText,
            thumbnails: new Thumbnails().load(thumbnail.thumbnails),
        });
        // Like Count and Dislike Count
        var topLevelButtons = videoInfo.videoActions.menuRenderer.topLevelButtons;
        target.likeCount = stripToInt(BaseVideoParser.parseButtonRenderer(topLevelButtons[0]));
        // Tags and description
        target.tags =
            ((_b = (_a = videoInfo.superTitleLink) === null || _a === void 0 ? void 0 : _a.runs) === null || _b === void 0 ? void 0 : _b.map(function (r) { return r.text.trim(); }).filter(function (t) { return t; })) || [];
        target.description = videoInfo.videoDetails.shortDescription || "";
        // related videos
        var secondaryContents = (_c = data.response.contents.twoColumnWatchNextResults.secondaryResults) === null || _c === void 0 ? void 0 : _c.secondaryResults.results;
        if (secondaryContents) {
            target.related.items = BaseVideoParser.parseRelatedFromSecondaryContent(secondaryContents, target.client);
            target.related.continuation = getContinuationFromItems(secondaryContents);
        }
        // captions
        if (videoInfo.captions) {
            target.captions = new VideoCaptions({ client: target.client, video: target }).load(videoInfo.captions.playerCaptionsTracklistRenderer);
        }
        return target;
    };
    BaseVideoParser.parseRelated = function (data, client) {
        var secondaryContents = data.onResponseReceivedEndpoints[0].appendContinuationItemsAction.continuationItems;
        return BaseVideoParser.parseRelatedFromSecondaryContent(secondaryContents, client);
    };
    BaseVideoParser.parseContinuation = function (data) {
        var secondaryContents = data.onResponseReceivedEndpoints[0].appendContinuationItemsAction.continuationItems;
        return getContinuationFromItems(secondaryContents);
    };
    BaseVideoParser.parseRawData = function (data) {
        var contents = data.response.contents.twoColumnWatchNextResults.results.results.contents;
        var primaryInfo = contents.find(function (c) { return "videoPrimaryInfoRenderer" in c; })
            .videoPrimaryInfoRenderer;
        var secondaryInfo = contents.find(function (c) { return "videoSecondaryInfoRenderer" in c; }).videoSecondaryInfoRenderer;
        var _a = data.playerResponse, videoDetails = _a.videoDetails, captions = _a.captions;
        return __assign(__assign(__assign({}, secondaryInfo), primaryInfo), { videoDetails: videoDetails, captions: captions });
    };
    BaseVideoParser.parseCompactRenderer = function (data, client) {
        if ("compactVideoRenderer" in data) {
            return new VideoCompact({ client: client }).load(data.compactVideoRenderer);
        }
        else if ("compactRadioRenderer" in data) {
            return new PlaylistCompact({ client: client }).load(data.compactRadioRenderer);
        }
    };
    BaseVideoParser.parseRelatedFromSecondaryContent = function (secondaryContents, client) {
        return secondaryContents
            .map(function (c) { return BaseVideoParser.parseCompactRenderer(c, client); })
            .filter(function (c) { return c !== undefined; });
    };
    BaseVideoParser.parseButtonRenderer = function (data) {
        var _a, _b;
        var likeCount;
        if (data.toggleButtonRenderer || data.buttonRenderer) {
            var buttonRenderer = data.toggleButtonRenderer || data.buttonRenderer;
            likeCount = (((_a = buttonRenderer.defaultText) === null || _a === void 0 ? void 0 : _a.accessibility) || buttonRenderer.accessibilityData).accessibilityData;
        }
        else if (data.segmentedLikeDislikeButtonRenderer) {
            var likeButton = data.segmentedLikeDislikeButtonRenderer.likeButton;
            var buttonRenderer = likeButton.toggleButtonRenderer || likeButton.buttonRenderer;
            likeCount = (((_b = buttonRenderer.defaultText) === null || _b === void 0 ? void 0 : _b.accessibility) || buttonRenderer.accessibilityData).accessibilityData;
        }
        else if (data.segmentedLikeDislikeButtonViewModel) {
            likeCount =
                data.segmentedLikeDislikeButtonViewModel.likeButtonViewModel.likeButtonViewModel
                    .toggleButtonViewModel.toggleButtonViewModel.defaultButtonViewModel
                    .buttonViewModel.accessibilityText;
        }
        return likeCount;
    };
    return BaseVideoParser;
}());
export { BaseVideoParser };
