var __values = (this && this.__values) || function(o) {
    var s = typeof Symbol === "function" && Symbol.iterator, m = s && o[s], i = 0;
    if (m) return m.call(o);
    if (o && typeof o.length === "number") return {
        next: function () {
            if (o && i >= o.length) o = void 0;
            return { value: o && o[i++], done: !o };
        }
    };
    throw new TypeError(s ? "Object is not iterable." : "Symbol.iterator is not defined.");
};
import { Thumbnails } from "../../common";
import { BaseChannel } from "../BaseChannel";
import { PlaylistCompact } from "../PlaylistCompact";
import { VideoCompact } from "../VideoCompact";
var ChannelParser = /** @class */ (function () {
    function ChannelParser() {
    }
    ChannelParser.loadChannel = function (target, data) {
        var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l;
        var channelId, title, handle, description, avatar, subscriberCountText, videoCountText, tvBanner, mobileBanner, banner;
        var _m = data.header, c4TabbedHeaderRenderer = _m.c4TabbedHeaderRenderer, pageHeaderRenderer = _m.pageHeaderRenderer;
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
            var _o = pageHeaderRenderer.content.pageHeaderViewModel, metadata = _o.metadata, imageModel = _o.image, bannerModel = _o.banner, descriptionModel = _o.description;
            var metadataRow = metadata.contentMetadataViewModel.metadataRows.find(function (m) { return m.metadataParts && m.metadataParts.length == 2; });
            var handleRow = metadata.contentMetadataViewModel.metadataRows.find(function (m) { return m.metadataParts && m.metadataParts.length == 1; });
            handle = (_j = handleRow === null || handleRow === void 0 ? void 0 : handleRow.metadataParts[0].text) === null || _j === void 0 ? void 0 : _j.content;
            videoCountText = (_k = metadataRow.metadataParts.find(function (m) { return m.text.styleRuns; })) === null || _k === void 0 ? void 0 : _k.text.content;
            subscriberCountText = (_l = metadataRow.metadataParts.find(function (m) { return !m.text.styleRuns; })) === null || _l === void 0 ? void 0 : _l.text.content;
            avatar = imageModel.decoratedAvatarViewModel.avatar.avatarViewModel.image.sources;
            banner = bannerModel === null || bannerModel === void 0 ? void 0 : bannerModel.imageBannerViewModel.image.sources;
            description = descriptionModel === null || descriptionModel === void 0 ? void 0 : descriptionModel.descriptionPreviewViewModel.description.content;
        }
        target.id = channelId;
        target.name = title;
        target.handle = handle;
        target.description = description;
        target.thumbnails = new Thumbnails().load(avatar);
        target.videoCount = videoCountText;
        target.subscriberCount = subscriberCountText;
        target.banner = new Thumbnails().load(banner || []);
        target.tvBanner = new Thumbnails().load(tvBanner || []);
        target.mobileBanner = new Thumbnails().load(mobileBanner || []);
        target.shelves = ChannelParser.parseShelves(target, data);
        return target;
    };
    ChannelParser.parseShelves = function (target, data) {
        var e_1, _a;
        var _b;
        var shelves = [];
        var rawShelves = data.contents.twoColumnBrowseResultsRenderer.tabs[0].tabRenderer.content
            .sectionListRenderer.contents;
        try {
            for (var rawShelves_1 = __values(rawShelves), rawShelves_1_1 = rawShelves_1.next(); !rawShelves_1_1.done; rawShelves_1_1 = rawShelves_1.next()) {
                var rawShelf = rawShelves_1_1.value;
                var shelfRenderer = (_b = rawShelf.itemSectionRenderer) === null || _b === void 0 ? void 0 : _b.contents[0].shelfRenderer;
                if (!shelfRenderer)
                    continue;
                var title = shelfRenderer.title, content = shelfRenderer.content, subtitle = shelfRenderer.subtitle;
                if (!content.horizontalListRenderer)
                    continue;
                var items = content.horizontalListRenderer.items
                    .map(function (i) {
                    if (i.gridVideoRenderer)
                        return new VideoCompact({ client: target.client }).load(i.gridVideoRenderer);
                    if (i.gridPlaylistRenderer)
                        return new PlaylistCompact({ client: target.client }).load(i.gridPlaylistRenderer);
                    if (i.gridChannelRenderer)
                        return new BaseChannel({ client: target.client }).load(i.gridChannelRenderer);
                    return undefined;
                })
                    .filter(function (i) { return i !== undefined; });
                var shelf = {
                    title: title.simpleText || title.runs[0].text,
                    subtitle: subtitle === null || subtitle === void 0 ? void 0 : subtitle.simpleText,
                    items: items,
                };
                shelves.push(shelf);
            }
        }
        catch (e_1_1) { e_1 = { error: e_1_1 }; }
        finally {
            try {
                if (rawShelves_1_1 && !rawShelves_1_1.done && (_a = rawShelves_1.return)) _a.call(rawShelves_1);
            }
            finally { if (e_1) throw e_1.error; }
        }
        return shelves;
    };
    return ChannelParser;
}());
export { ChannelParser };
