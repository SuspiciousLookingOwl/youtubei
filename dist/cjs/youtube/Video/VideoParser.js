"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.VideoParser = void 0;
const common_1 = require("../../common");
const BaseVideo_1 = require("../BaseVideo");
const Comment_1 = require("../Comment");
class VideoParser {
    static loadVideo(target, data) {
        var _a, _b, _c, _d, _e;
        const videoInfo = BaseVideo_1.BaseVideoParser.parseRawData(data);
        target.duration = +videoInfo.videoDetails.lengthSeconds;
        const itemSectionRenderer = (_a = data.response.contents.twoColumnWatchNextResults.results.results.contents
            .reverse()
            .find((c) => c.itemSectionRenderer)) === null || _a === void 0 ? void 0 : _a.itemSectionRenderer;
        target.comments.continuation = common_1.getContinuationFromItems((itemSectionRenderer === null || itemSectionRenderer === void 0 ? void 0 : itemSectionRenderer.contents) || []);
        const chapters = (_c = (_b = data.response.playerOverlays.playerOverlayRenderer.decoratedPlayerBarRenderer) === null || _b === void 0 ? void 0 : _b.decoratedPlayerBarRenderer.playerBar.multiMarkersPlayerBarRenderer.markersMap) === null || _c === void 0 ? void 0 : _c[0].value.chapters;
        target.chapters =
            (chapters === null || chapters === void 0 ? void 0 : chapters.map(({ chapterRenderer: c }) => ({
                title: c.title.simpleText,
                start: c.timeRangeStartMillis,
                thumbnails: new common_1.Thumbnails().load(c.thumbnail.thumbnails),
            }))) || [];
        const musicPanel = (_d = data.response.engagementPanels) === null || _d === void 0 ? void 0 : _d.find((e) => { var _a, _b; return (_b = (_a = e.engagementPanelSectionListRenderer.content) === null || _a === void 0 ? void 0 : _a.structuredDescriptionContentRenderer) === null || _b === void 0 ? void 0 : _b.items.find((i) => { var _a, _b; return ((_b = (_a = i.horizontalCardListRenderer) === null || _a === void 0 ? void 0 : _a.footerButton) === null || _b === void 0 ? void 0 : _b.buttonViewModel.iconName) === "MUSIC"; }); });
        if (!musicPanel) {
            target.music = null;
        }
        else {
            const cards = musicPanel.engagementPanelSectionListRenderer.content.structuredDescriptionContentRenderer.items.find((i) => { var _a, _b; return ((_b = (_a = i.horizontalCardListRenderer) === null || _a === void 0 ? void 0 : _a.footerButton) === null || _b === void 0 ? void 0 : _b.buttonViewModel.iconName) === "MUSIC"; }).horizontalCardListRenderer.cards;
            const music = cards.find((i) => i.videoAttributeViewModel)
                .videoAttributeViewModel;
            target.music = {
                imageUrl: music.image.sources[0].url,
                title: music.title,
                artist: music.subtitle,
                album: ((_e = music.secondarySubtitle) === null || _e === void 0 ? void 0 : _e.content) || null,
            };
        }
        // target.music =
        return target;
    }
    static parseComments(data, video) {
        const endpoints = data.onResponseReceivedEndpoints.find((c) => {
            var _a;
            return (c.appendContinuationItemsAction ||
                ((_a = c.reloadContinuationItemsCommand) === null || _a === void 0 ? void 0 : _a.slot) === "RELOAD_CONTINUATION_SLOT_BODY");
        });
        const repliesContinuationItems = (endpoints.reloadContinuationItemsCommand || endpoints.appendContinuationItemsAction).continuationItems;
        const comments = data.frameworkUpdates.entityBatchUpdate.mutations
            .filter((m) => m.payload.commentEntityPayload)
            .map((m) => {
            var _a;
            const repliesItems = (_a = repliesContinuationItems.find((r) => r.commentThreadRenderer.commentViewModel.commentKey === m.key)) === null || _a === void 0 ? void 0 : _a.commentThreadRenderer;
            return Object.assign(Object.assign({}, m.payload.commentEntityPayload), repliesItems);
        });
        return comments.map((c) => new Comment_1.Comment({ video, client: video.client }).load(c));
    }
    static parseCommentContinuation(data) {
        const endpoints = data.onResponseReceivedEndpoints.at(-1);
        const continuationItems = (endpoints.reloadContinuationItemsCommand || endpoints.appendContinuationItemsAction).continuationItems;
        return common_1.getContinuationFromItems(continuationItems);
    }
}
exports.VideoParser = VideoParser;
