"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BaseVideoParser = void 0;
const common_1 = require("../../common");
const BaseChannel_1 = require("../BaseChannel");
const PlaylistCompact_1 = require("../PlaylistCompact");
const VideoCompact_1 = require("../VideoCompact");
const VideoCaptions_1 = require("./VideoCaptions");
class BaseVideoParser {
    static loadBaseVideo(target, data) {
        var _a, _b, _c, _d, _e, _f, _g, _h, _j;
        const videoInfo = BaseVideoParser.parseRawData(data);
        // Basic information
        target.id = videoInfo.currentVideoEndpoint.watchEndpoint.videoId;
        target.title =
            videoInfo.playerOverlays.playerOverlayRenderer.videoDetails.playerOverlayVideoDetailsRenderer.title.simpleText;
        target.viewCount =
            common_1.stripToInt(videoInfo.viewCount.videoViewCountRenderer.viewCount.simpleText) || null;
        target.isLiveContent = !!((_a = videoInfo.videoDetails) === null || _a === void 0 ? void 0 : _a.isLiveContent); // TODO remove dependence on player data
        target.uploadDate = videoInfo.dateText.simpleText;
        target.formats = ((_b = videoInfo.streamingData) === null || _b === void 0 ? void 0 : _b.formats) || [];
        target.adaptiveFormats = ((_c = videoInfo.streamingData) === null || _c === void 0 ? void 0 : _c.adaptiveFormats) || [];
        target.thumbnails = new common_1.Thumbnails().load(((_d = videoInfo.videoDetails) === null || _d === void 0 ? void 0 : _d.thumbnail.thumbnails) || common_1.getThumbnailFromId(target.id));
        // Channel
        const { title, thumbnail, subscriberCountText } = videoInfo.owner.videoOwnerRenderer;
        if (title) {
            target.channel = new BaseChannel_1.BaseChannel({
                client: target.client,
                id: title.runs[0].navigationEndpoint.browseEndpoint.browseId,
                name: title.runs[0].text,
                subscriberCount: subscriberCountText === null || subscriberCountText === void 0 ? void 0 : subscriberCountText.simpleText,
                thumbnails: new common_1.Thumbnails().load(thumbnail.thumbnails),
            });
        }
        if (videoInfo.owner.videoOwnerRenderer.attributedTitle) {
            const channelsData = videoInfo.owner.videoOwnerRenderer.attributedTitle.commandRuns[0].onTap
                .innertubeCommand.showDialogCommand.panelLoadingStrategy.inlineContent
                .dialogViewModel.customContent.listViewModel.listItems;
            const avatarsData = videoInfo.owner.videoOwnerRenderer.avatarStack.avatarStackViewModel.avatars;
            target.channels = channelsData.map((c, i) => {
                const viewModel = c.listItemViewModel;
                const thumbnail = avatarsData[i].avatarViewModel.image.sources;
                return new BaseChannel_1.BaseChannel({
                    client: target.client,
                    id: viewModel.title.commandRuns[0].onTap.innertubeCommand.browseEndpoint
                        .browseId,
                    name: viewModel.title.content,
                    subscriberCount: viewModel.subtitle.content,
                    thumbnails: new common_1.Thumbnails().load(thumbnail),
                });
            });
        }
        // Like Count and Dislike Count
        const topLevelButtons = videoInfo.videoActions.menuRenderer.topLevelButtons;
        target.likeCount = topLevelButtons
            ? common_1.stripToInt(BaseVideoParser.parseButtonRenderer(topLevelButtons[0]))
            : null;
        // Tags and description
        target.tags =
            ((_f = (_e = videoInfo.superTitleLink) === null || _e === void 0 ? void 0 : _e.runs) === null || _f === void 0 ? void 0 : _f.map((r) => r.text.trim()).filter((t) => t)) || [];
        target.description =
            ((_g = videoInfo.videoDetails) === null || _g === void 0 ? void 0 : _g.shortDescription) ||
                videoInfo.attributedDescription.content ||
                "";
        // related videos
        let secondaryContents = (_h = data.response.contents.twoColumnWatchNextResults.secondaryResults) === null || _h === void 0 ? void 0 : _h.secondaryResults.results;
        const itemSectionRenderer = (_j = secondaryContents === null || secondaryContents === void 0 ? void 0 : secondaryContents.find((c) => {
            return c.itemSectionRenderer;
        })) === null || _j === void 0 ? void 0 : _j.itemSectionRenderer;
        if (itemSectionRenderer)
            secondaryContents = itemSectionRenderer.contents;
        if (secondaryContents) {
            target.related.items = BaseVideoParser.parseRelatedFromSecondaryContent(secondaryContents, target.client);
            target.related.continuation = common_1.getContinuationFromItems(secondaryContents);
        }
        // captions
        if (videoInfo.captions) {
            target.captions = new VideoCaptions_1.VideoCaptions({ client: target.client, video: target }).load(videoInfo.captions.playerCaptionsTracklistRenderer);
        }
        return target;
    }
    static parseRelated(data, client) {
        const secondaryContents = data.onResponseReceivedEndpoints[0].appendContinuationItemsAction.continuationItems;
        return BaseVideoParser.parseRelatedFromSecondaryContent(secondaryContents, client);
    }
    static parseContinuation(data) {
        const secondaryContents = data.onResponseReceivedEndpoints[0].appendContinuationItemsAction.continuationItems;
        return common_1.getContinuationFromItems(secondaryContents);
    }
    static parseRawData(data) {
        const contents = data.response.contents.twoColumnWatchNextResults.results.results.contents;
        const primaryInfo = contents.find((c) => "videoPrimaryInfoRenderer" in c)
            .videoPrimaryInfoRenderer;
        const secondaryInfo = contents.find((c) => "videoSecondaryInfoRenderer" in c).videoSecondaryInfoRenderer;
        const { videoDetails, captions, streamingData } = data.playerResponse;
        return Object.assign(Object.assign(Object.assign(Object.assign({}, data.response), secondaryInfo), primaryInfo), { videoDetails,
            captions,
            streamingData });
    }
    static parseCompactRenderer(data, client) {
        if ("compactVideoRenderer" in data) {
            return new VideoCompact_1.VideoCompact({ client }).load(data.compactVideoRenderer);
        }
        else if ("compactRadioRenderer" in data) {
            return new PlaylistCompact_1.PlaylistCompact({ client }).load(data.compactRadioRenderer);
        }
        else if ("lockupViewModel" in data) {
            // new data structure for related contents
            const type = data.lockupViewModel.contentType;
            if (type === "LOCKUP_CONTENT_TYPE_VIDEO") {
                return new VideoCompact_1.VideoCompact({ client }).loadLockup(data.lockupViewModel);
            }
            else if (type === "LOCKUP_CONTENT_TYPE_PLAYLIST") {
                return new PlaylistCompact_1.PlaylistCompact({ client }).loadLockup(data.lockupViewModel);
            }
        }
    }
    static parseRelatedFromSecondaryContent(secondaryContents, client) {
        return secondaryContents
            .map((c) => BaseVideoParser.parseCompactRenderer(c, client))
            .filter((c) => c !== undefined);
    }
    static parseButtonRenderer(data) {
        var _a, _b;
        let likeCount;
        if (data.toggleButtonRenderer || data.buttonRenderer) {
            const buttonRenderer = data.toggleButtonRenderer || data.buttonRenderer;
            likeCount = (((_a = buttonRenderer.defaultText) === null || _a === void 0 ? void 0 : _a.accessibility) || buttonRenderer.accessibilityData).accessibilityData;
        }
        else if (data.segmentedLikeDislikeButtonRenderer) {
            const likeButton = data.segmentedLikeDislikeButtonRenderer.likeButton;
            const buttonRenderer = likeButton.toggleButtonRenderer || likeButton.buttonRenderer;
            likeCount = (((_b = buttonRenderer.defaultText) === null || _b === void 0 ? void 0 : _b.accessibility) || buttonRenderer.accessibilityData).accessibilityData;
        }
        else if (data.segmentedLikeDislikeButtonViewModel) {
            likeCount =
                data.segmentedLikeDislikeButtonViewModel.likeButtonViewModel.likeButtonViewModel
                    .toggleButtonViewModel.toggleButtonViewModel.defaultButtonViewModel
                    .buttonViewModel.accessibilityText;
        }
        return likeCount;
    }
}
exports.BaseVideoParser = BaseVideoParser;
