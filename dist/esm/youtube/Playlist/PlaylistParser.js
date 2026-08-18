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
        var _a, _b;
        var sidebarRenderer = data.sidebar.playlistSidebarRenderer.items;
        var primaryRenderer = sidebarRenderer[0].playlistSidebarPrimaryInfoRenderer;
        var metadata = data.metadata.playlistMetadataRenderer;
        // Basic information
        target.id = (_a = Object.values(metadata)
            .find(function (v) { return v.includes("playlist?list="); })) === null || _a === void 0 ? void 0 : _a.split("=")[1];
        target.title = metadata.title;
        var _c = primaryRenderer.thumbnailRenderer, playlistVideoThumbnailRenderer = _c.playlistVideoThumbnailRenderer, playlistCustomThumbnailRenderer = _c.playlistCustomThumbnailRenderer;
        target.thumbnails = new Thumbnails().load((playlistVideoThumbnailRenderer || playlistCustomThumbnailRenderer).thumbnail.thumbnails);
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
        var playlistContents = data.contents.twoColumnBrowseResultsRenderer.tabs[0].tabRenderer.content
            .sectionListRenderer.contents[0].itemSectionRenderer.contents || [];
        // Channel
        var videoOwner = (_b = sidebarRenderer[1]) === null || _b === void 0 ? void 0 : _b.playlistSidebarSecondaryInfoRenderer.videoOwner;
        if (videoOwner === null || videoOwner === void 0 ? void 0 : videoOwner.videoOwnerRenderer.title.runs) {
            var _d = videoOwner.videoOwnerRenderer, title = _d.title, thumbnail = _d.thumbnail;
            target.channel = new BaseChannel({
                id: title.runs[0].navigationEndpoint.browseEndpoint.browseId,
                name: title.runs[0].text,
                thumbnails: new Thumbnails().load(thumbnail.thumbnails),
                client: target.client,
            });
        }
        var playlistContentRenderer = playlistContents[0].playlistVideoListRenderer
            ? playlistContents[0].playlistVideoListRenderer.contents
            : playlistContents;
        // Videos
        target.videos.items = PlaylistParser.parseVideos(playlistContentRenderer, target);
        target.videos.continuation = getContinuationFromItems(playlistContentRenderer);
        return target;
    };
    PlaylistParser.parseVideoContinuation = function (data) {
        var playlistContents = data.onResponseReceivedActions[0].appendContinuationItemsAction.continuationItems;
        return getContinuationFromItems(playlistContents);
    };
    PlaylistParser.parseContinuationVideos = function (data, client) {
        var playlistContents = data.onResponseReceivedActions[0].appendContinuationItemsAction.continuationItems;
        var videos = mapFilter(playlistContents, "lockupViewModel");
        return videos.map(function (video) {
            return new VideoCompact({ client: client }).loadLockup(video);
        });
    };
    /**
     * Get compact videos
     *
     * @param playlistContents raw object from youtubei
     */
    PlaylistParser.parseVideos = function (playlistContents, playlist) {
        var e_1, _a;
        var videos = [];
        try {
            for (var playlistContents_1 = __values(playlistContents), playlistContents_1_1 = playlistContents_1.next(); !playlistContents_1_1.done; playlistContents_1_1 = playlistContents_1.next()) {
                var content = playlistContents_1_1.value;
                var video = void 0;
                if (content.lockupViewModel) {
                    video = new VideoCompact({ client: playlist.client }).loadLockup(content.lockupViewModel);
                }
                else if (content.playlistVideoRenderer) {
                    video = new VideoCompact({ client: playlist.client }).load(content.playlistVideoRenderer);
                }
                if (!video)
                    continue;
                videos.push(video);
            }
        }
        catch (e_1_1) { e_1 = { error: e_1_1 }; }
        finally {
            try {
                if (playlistContents_1_1 && !playlistContents_1_1.done && (_a = playlistContents_1.return)) _a.call(playlistContents_1);
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
