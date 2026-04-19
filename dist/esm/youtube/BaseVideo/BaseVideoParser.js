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
import { getContinuationFromItems, getThumbnailFromId, stripToInt, Thumbnails, } from "../../common";
import { BaseChannel } from "../BaseChannel";
import { PlaylistCompact } from "../PlaylistCompact";
import { VideoCompact } from "../VideoCompact";
import { VideoCaptions } from "./VideoCaptions";
var BaseVideoParser = /** @class */ (function () {
    function BaseVideoParser() {
    }
    BaseVideoParser.loadBaseVideo = function (target, data) {
        var _a, _b, _c, _d, _e, _f, _g, _h;
        var videoInfo = BaseVideoParser.parseRawData(data);
        // Basic information
        target.id = videoInfo.currentVideoEndpoint.watchEndpoint.videoId;
        target.title =
            videoInfo.playerOverlays.playerOverlayRenderer.videoDetails.playerOverlayVideoDetailsRenderer.title.simpleText;
        target.viewCount =
            stripToInt(videoInfo.viewCount.videoViewCountRenderer.viewCount.simpleText) || null;
        target.isLiveContent = !!((_a = videoInfo.videoDetails) === null || _a === void 0 ? void 0 : _a.isLiveContent); // TODO remove dependence on player data
        target.uploadDate = videoInfo.dateText.simpleText;
        target.formats = ((_b = videoInfo.streamingData) === null || _b === void 0 ? void 0 : _b.formats) || [];
        target.adaptiveFormats = ((_c = videoInfo.streamingData) === null || _c === void 0 ? void 0 : _c.adaptiveFormats) || [];
        target.thumbnails = new Thumbnails().load(((_d = videoInfo.videoDetails) === null || _d === void 0 ? void 0 : _d.thumbnail.thumbnails) || getThumbnailFromId(target.id));
        // Channel
        var _j = videoInfo.owner.videoOwnerRenderer, title = _j.title, thumbnail = _j.thumbnail, subscriberCountText = _j.subscriberCountText;
        if (title) {
            target.channel = new BaseChannel({
                client: target.client,
                id: title.runs[0].navigationEndpoint.browseEndpoint.browseId,
                name: title.runs[0].text,
                subscriberCount: subscriberCountText === null || subscriberCountText === void 0 ? void 0 : subscriberCountText.simpleText,
                thumbnails: new Thumbnails().load(thumbnail.thumbnails),
            });
        }
        if (videoInfo.owner.videoOwnerRenderer.attributedTitle) {
            var channelsData = videoInfo.owner.videoOwnerRenderer.attributedTitle.commandRuns[0].onTap
                .innertubeCommand.showDialogCommand.panelLoadingStrategy.inlineContent
                .dialogViewModel.customContent.listViewModel.listItems;
            var avatarsData_1 = videoInfo.owner.videoOwnerRenderer.avatarStack.avatarStackViewModel.avatars;
            target.channels = channelsData.map(function (c, i) {
                var viewModel = c.listItemViewModel;
                var thumbnail = avatarsData_1[i].avatarViewModel.image.sources;
                return new BaseChannel({
                    client: target.client,
                    id: viewModel.title.commandRuns[0].onTap.innertubeCommand.browseEndpoint
                        .browseId,
                    name: viewModel.title.content,
                    subscriberCount: viewModel.subtitle.content,
                    thumbnails: new Thumbnails().load(thumbnail),
                });
            });
        }
        // Like Count and Dislike Count
        var topLevelButtons = videoInfo.videoActions.menuRenderer.topLevelButtons;
        target.likeCount = topLevelButtons
            ? stripToInt(BaseVideoParser.parseButtonRenderer(topLevelButtons[0]))
            : null;
        // Tags and description
        target.tags =
            ((_f = (_e = videoInfo.superTitleLink) === null || _e === void 0 ? void 0 : _e.runs) === null || _f === void 0 ? void 0 : _f.map(function (r) { return r.text.trim(); }).filter(function (t) { return t; })) || [];
        target.description = videoInfo.attributedDescription.content || ""; // TODO
        // related videos
        var secondaryContents = (_g = data.response.contents.twoColumnWatchNextResults.secondaryResults) === null || _g === void 0 ? void 0 : _g.secondaryResults.results;
        var itemSectionRenderer = (_h = secondaryContents === null || secondaryContents === void 0 ? void 0 : secondaryContents.find(function (c) {
            return c.itemSectionRenderer;
        })) === null || _h === void 0 ? void 0 : _h.itemSectionRenderer;
        if (itemSectionRenderer)
            secondaryContents = itemSectionRenderer.contents;
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
        var _a = data.playerResponse, videoDetails = _a.videoDetails, captions = _a.captions, streamingData = _a.streamingData;
        return __assign(__assign(__assign(__assign({}, data.response), secondaryInfo), primaryInfo), { videoDetails: videoDetails,
            captions: captions,
            streamingData: streamingData });
    };
    BaseVideoParser.parseCompactRenderer = function (data, client) {
        if ("compactVideoRenderer" in data) {
            return new VideoCompact({ client: client }).load(data.compactVideoRenderer);
        }
        else if ("compactRadioRenderer" in data) {
            return new PlaylistCompact({ client: client }).load(data.compactRadioRenderer);
        }
        else if ("lockupViewModel" in data) {
            // new data structure for related contents
            var type = data.lockupViewModel.contentType;
            if (type === "LOCKUP_CONTENT_TYPE_VIDEO") {
                return new VideoCompact({ client: client }).loadLockup(data.lockupViewModel);
            }
            else if (type === "LOCKUP_CONTENT_TYPE_PLAYLIST") {
                return new PlaylistCompact({ client: client }).loadLockup(data.lockupViewModel);
            }
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
