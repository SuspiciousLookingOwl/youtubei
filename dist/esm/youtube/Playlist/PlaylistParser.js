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
import { getContinuationFromItems, mapFilter, Thumbnails } from "../../common";
import { BaseChannel } from "../BaseChannel";
import { VideoCompact } from "../VideoCompact";
var PlaylistParser = /** @class */ (function () {
    function PlaylistParser() {
    }
    PlaylistParser.loadPlaylist = function (target, data) {
        var _a, _b, _c;
        var sidebarRenderer = data.sidebar.playlistSidebarRenderer.items;
        var primaryRenderer = sidebarRenderer[0].playlistSidebarPrimaryInfoRenderer;
        var metadata = data.metadata.playlistMetadataRenderer;
        // Basic information
        target.id = (_a = Object.values(metadata)
            .find(function (v) { return v.includes("playlist?list="); })) === null || _a === void 0 ? void 0 : _a.split("=")[1];
        target.title = metadata.title;
        target.thumbnails = new Thumbnails().load(primaryRenderer.thumbnailRenderer.playlistVideoThumbnailRenderer.thumbnail.thumbnails);
        var stats = primaryRenderer.stats;
        if (primaryRenderer.stats.length === 3) {
            target.videoCount = PlaylistParser.parseSideBarInfo(stats[0], true);
            target.viewCount = PlaylistParser.parseSideBarInfo(stats[1], true);
            target.lastUpdatedAt = PlaylistParser.parseSideBarInfo(stats[2], false);
        }
        else if (stats.length === 2) {
            target.videoCount = PlaylistParser.parseSideBarInfo(stats[0], true);
            target.lastUpdatedAt = PlaylistParser.parseSideBarInfo(stats[1], false);
        }
        var playlistContents = ((_b = data.contents.twoColumnBrowseResultsRenderer.tabs[0].tabRenderer.content
            .sectionListRenderer.contents[0].itemSectionRenderer.contents[0]
            .playlistVideoListRenderer) === null || _b === void 0 ? void 0 : _b.contents) || [];
        // Channel
        var videoOwner = (_c = sidebarRenderer[1]) === null || _c === void 0 ? void 0 : _c.playlistSidebarSecondaryInfoRenderer.videoOwner;
        if (videoOwner) {
            var _d = videoOwner.videoOwnerRenderer, title = _d.title, thumbnail = _d.thumbnail;
            target.channel = new BaseChannel({
                id: title.runs[0].navigationEndpoint.browseEndpoint.browseId,
                name: title.runs[0].text,
                thumbnails: new Thumbnails().load(thumbnail.thumbnails),
                client: target.client,
            });
        }
        // Videos
        target.videos.items = PlaylistParser.parseVideos(playlistContents, target);
        target.videos.continuation = getContinuationFromItems(playlistContents);
        return target;
    };
    PlaylistParser.parseVideoContinuation = function (data) {
        var playlistContents = data.onResponseReceivedActions[0].appendContinuationItemsAction.continuationItems;
        return getContinuationFromItems(playlistContents);
    };
    PlaylistParser.parseContinuationVideos = function (data, client) {
        var playlistContents = data.onResponseReceivedActions[0].appendContinuationItemsAction.continuationItems;
        var videos = mapFilter(playlistContents, "playlistVideoRenderer");
        return videos.map(function (video) { return new VideoCompact({ client: client }).load(video); });
    };
    /**
     * Get compact videos
     *
     * @param playlistContents raw object from youtubei
     */
    PlaylistParser.parseVideos = function (playlistContents, playlist) {
        var e_1, _a;
        var videosRenderer = playlistContents.map(function (c) { return c.playlistVideoRenderer; });
        var videos = [];
        try {
            for (var videosRenderer_1 = __values(videosRenderer), videosRenderer_1_1 = videosRenderer_1.next(); !videosRenderer_1_1.done; videosRenderer_1_1 = videosRenderer_1.next()) {
                var videoRenderer = videosRenderer_1_1.value;
                if (!videoRenderer)
                    continue;
                var video = new VideoCompact({ client: playlist.client }).load(videoRenderer);
                videos.push(video);
            }
        }
        catch (e_1_1) { e_1 = { error: e_1_1 }; }
        finally {
            try {
                if (videosRenderer_1_1 && !videosRenderer_1_1.done && (_a = videosRenderer_1.return)) _a.call(videosRenderer_1);
            }
            finally { if (e_1) throw e_1.error; }
        }
        return videos;
    };
    PlaylistParser.parseSideBarInfo = function (stats, parseInt) {
        var data;
        if ("runs" in stats)
            data = stats.runs.map(function (r) { return r.text; }).join("");
        else
            data = stats.simpleText.replace(/[^0-9]/g, "");
        if (parseInt)
            data = +data.replace(/[^0-9]/g, "");
        return data;
    };
    return PlaylistParser;
}());
export { PlaylistParser };
