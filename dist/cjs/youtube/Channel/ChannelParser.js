"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChannelParser = void 0;
const common_1 = require("../../common");
const BaseChannel_1 = require("../BaseChannel");
const PlaylistCompact_1 = require("../PlaylistCompact");
const VideoCompact_1 = require("../VideoCompact");
class ChannelParser {
    static loadChannel(target, data) {
        var _a, _b, _c, _d, _e, _f, _g, _h, _j;
        let channelId, title, avatar, subscriberCountText, videoCountText, tvBanner, mobileBanner, banner;
        const { c4TabbedHeaderRenderer, pageHeaderRenderer } = data.header;
        if (c4TabbedHeaderRenderer) {
            channelId = c4TabbedHeaderRenderer.channelId;
            title = c4TabbedHeaderRenderer.title;
            subscriberCountText = (_a = c4TabbedHeaderRenderer.subscriberCountText) === null || _a === void 0 ? void 0 : _a.simpleText;
            videoCountText = (_d = (_c = (_b = c4TabbedHeaderRenderer === null || c4TabbedHeaderRenderer === void 0 ? void 0 : c4TabbedHeaderRenderer.videosCountText) === null || _b === void 0 ? void 0 : _b.runs) === null || _c === void 0 ? void 0 : _c[0]) === null || _d === void 0 ? void 0 : _d.text;
            avatar = (_e = c4TabbedHeaderRenderer.avatar) === null || _e === void 0 ? void 0 : _e.thumbnails;
            tvBanner = (_f = c4TabbedHeaderRenderer === null || c4TabbedHeaderRenderer === void 0 ? void 0 : c4TabbedHeaderRenderer.tvBanner) === null || _f === void 0 ? void 0 : _f.thumbnails;
            mobileBanner = (_g = c4TabbedHeaderRenderer === null || c4TabbedHeaderRenderer === void 0 ? void 0 : c4TabbedHeaderRenderer.mobileBanner) === null || _g === void 0 ? void 0 : _g.thumbnails;
            banner = (_h = c4TabbedHeaderRenderer === null || c4TabbedHeaderRenderer === void 0 ? void 0 : c4TabbedHeaderRenderer.banner) === null || _h === void 0 ? void 0 : _h.thumbnails;
        }
        else {
            channelId =
                data.contents.twoColumnBrowseResultsRenderer.tabs[0].tabRenderer.endpoint
                    .browseEndpoint.browseId;
            title = pageHeaderRenderer.pageTitle;
            const { metadata, image: imageModel, banner: bannerModel, } = pageHeaderRenderer.content.pageHeaderViewModel;
            const metadataRow = metadata.contentMetadataViewModel.metadataRows[1];
            subscriberCountText = metadataRow.metadataParts.find((m) => !m.text.styeRuns).text.content;
            videoCountText = (_j = metadataRow.metadataParts.find((m) => m.text.styeRuns)) === null || _j === void 0 ? void 0 : _j.text.content;
            avatar = imageModel.decoratedAvatarViewModel.avatar.avatarViewModel.image.sources;
            banner = bannerModel === null || bannerModel === void 0 ? void 0 : bannerModel.imageBannerViewModel.image.sources;
        }
        target.id = channelId;
        target.name = title;
        target.thumbnails = new common_1.Thumbnails().load(avatar);
        target.videoCount = videoCountText;
        target.subscriberCount = subscriberCountText;
        target.banner = new common_1.Thumbnails().load(banner || []);
        target.tvBanner = new common_1.Thumbnails().load(tvBanner || []);
        target.mobileBanner = new common_1.Thumbnails().load(mobileBanner || []);
        target.shelves = ChannelParser.parseShelves(target, data);
        return target;
    }
    static parseShelves(target, data) {
        var _a;
        const shelves = [];
        const rawShelves = data.contents.twoColumnBrowseResultsRenderer.tabs[0].tabRenderer.content
            .sectionListRenderer.contents;
        for (const rawShelf of rawShelves) {
            const shelfRenderer = (_a = rawShelf.itemSectionRenderer) === null || _a === void 0 ? void 0 : _a.contents[0].shelfRenderer;
            if (!shelfRenderer)
                continue;
            const { title, content, subtitle } = shelfRenderer;
            if (!content.horizontalListRenderer)
                continue;
            const items = content.horizontalListRenderer.items
                .map((i) => {
                if (i.gridVideoRenderer)
                    return new VideoCompact_1.VideoCompact({ client: target.client }).load(i.gridVideoRenderer);
                if (i.gridPlaylistRenderer)
                    return new PlaylistCompact_1.PlaylistCompact({ client: target.client }).load(i.gridPlaylistRenderer);
                if (i.gridChannelRenderer)
                    return new BaseChannel_1.BaseChannel({ client: target.client }).load(i.gridChannelRenderer);
                return undefined;
            })
                .filter((i) => i !== undefined);
            const shelf = {
                title: title.runs[0].text,
                subtitle: subtitle === null || subtitle === void 0 ? void 0 : subtitle.simpleText,
                items,
            };
            shelves.push(shelf);
        }
        return shelves;
    }
}
exports.ChannelParser = ChannelParser;
