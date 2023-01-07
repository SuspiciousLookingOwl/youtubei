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
        var _a = data.header.c4TabbedHeaderRenderer, channelId = _a.channelId, title = _a.title, avatar = _a.avatar, subscriberCountText = _a.subscriberCountText;
        target.id = channelId;
        target.name = title;
        target.thumbnails = new Thumbnails().load(avatar.thumbnails);
        target.videoCount = 0; // data not available
        target.subscriberCount = subscriberCountText === null || subscriberCountText === void 0 ? void 0 : subscriberCountText.simpleText;
        var _b = data.header.c4TabbedHeaderRenderer, tvBanner = _b.tvBanner, mobileBanner = _b.mobileBanner, banner = _b.banner;
        target.banner = new Thumbnails().load((banner === null || banner === void 0 ? void 0 : banner.thumbnails) || []);
        target.tvBanner = new Thumbnails().load((tvBanner === null || tvBanner === void 0 ? void 0 : tvBanner.thumbnails) || []);
        target.mobileBanner = new Thumbnails().load((mobileBanner === null || mobileBanner === void 0 ? void 0 : mobileBanner.thumbnails) || []);
        target.shelves = ChannelParser.parseShelves(target, data);
        return target;
    };
    ChannelParser.parseShelves = function (target, data) {
        var e_1, _a;
        var shelves = [];
        var rawShelves = data.contents.twoColumnBrowseResultsRenderer.tabs[0].tabRenderer.content
            .sectionListRenderer.contents;
        try {
            for (var rawShelves_1 = __values(rawShelves), rawShelves_1_1 = rawShelves_1.next(); !rawShelves_1_1.done; rawShelves_1_1 = rawShelves_1.next()) {
                var rawShelf = rawShelves_1_1.value;
                var shelfRenderer = rawShelf.itemSectionRenderer.contents[0].shelfRenderer;
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
                    title: title.runs[0].text,
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
