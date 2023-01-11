"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PlaylistParser = void 0;
const common_1 = require("../../common");
const BaseChannel_1 = require("../BaseChannel");
const VideoCompact_1 = require("../VideoCompact");
class PlaylistParser {
    static loadPlaylist(target, data) {
        var _a, _b, _c;
        const sidebarRenderer = data.sidebar.playlistSidebarRenderer.items;
        const primaryRenderer = sidebarRenderer[0].playlistSidebarPrimaryInfoRenderer;
        const metadata = data.metadata.playlistMetadataRenderer;
        // Basic information
        target.id = (_a = Object.values(metadata)
            .find((v) => v.includes("playlist?list="))) === null || _a === void 0 ? void 0 : _a.split("=")[1];
        target.title = metadata.title;
        target.thumbnails = new common_1.Thumbnails().load(primaryRenderer.thumbnailRenderer.playlistVideoThumbnailRenderer.thumbnail.thumbnails);
        const { stats } = primaryRenderer;
        if (primaryRenderer.stats.length === 3) {
            target.videoCount = PlaylistParser.parseSideBarInfo(stats[0], true);
            target.viewCount = PlaylistParser.parseSideBarInfo(stats[1], true);
            target.lastUpdatedAt = PlaylistParser.parseSideBarInfo(stats[2], false);
        }
        else if (stats.length === 2) {
            target.videoCount = PlaylistParser.parseSideBarInfo(stats[0], true);
            target.lastUpdatedAt = PlaylistParser.parseSideBarInfo(stats[1], false);
        }
        const playlistContents = ((_b = data.contents.twoColumnBrowseResultsRenderer.tabs[0].tabRenderer.content
            .sectionListRenderer.contents[0].itemSectionRenderer.contents[0]
            .playlistVideoListRenderer) === null || _b === void 0 ? void 0 : _b.contents) || [];
        // Channel
        const videoOwner = (_c = sidebarRenderer[1]) === null || _c === void 0 ? void 0 : _c.playlistSidebarSecondaryInfoRenderer.videoOwner;
        if (videoOwner) {
            const { title, thumbnail } = videoOwner.videoOwnerRenderer;
            target.channel = new BaseChannel_1.BaseChannel({
                id: title.runs[0].navigationEndpoint.browseEndpoint.browseId,
                name: title.runs[0].text,
                thumbnails: new common_1.Thumbnails().load(thumbnail.thumbnails),
                client: target.client,
            });
        }
        // Videos
        target.videos.items = PlaylistParser.parseVideos(playlistContents, target);
        target.videos.continuation = common_1.getContinuationFromItems(playlistContents);
        return target;
    }
    static parseVideoContinuation(data) {
        const playlistContents = data.onResponseReceivedActions[0].appendContinuationItemsAction.continuationItems;
        return common_1.getContinuationFromItems(playlistContents);
    }
    static parseContinuationVideos(data, client) {
        const playlistContents = data.onResponseReceivedActions[0].appendContinuationItemsAction.continuationItems;
        const videos = common_1.mapFilter(playlistContents, "playlistVideoRenderer");
        return videos.map((video) => new VideoCompact_1.VideoCompact({ client }).load(video));
    }
    /**
     * Get compact videos
     *
     * @param playlistContents raw object from youtubei
     */
    static parseVideos(playlistContents, playlist) {
        const videosRenderer = playlistContents.map((c) => c.playlistVideoRenderer);
        const videos = [];
        for (const videoRenderer of videosRenderer) {
            if (!videoRenderer)
                continue;
            const video = new VideoCompact_1.VideoCompact({ client: playlist.client }).load(videoRenderer);
            videos.push(video);
        }
        return videos;
    }
    static parseSideBarInfo(stats, parseInt) {
        let data;
        if ("runs" in stats)
            data = stats.runs.map((r) => r.text).join("");
        else
            data = stats.simpleText.replace(/[^0-9]/g, "");
        if (parseInt)
            data = +data.replace(/[^0-9]/g, "");
        return data;
    }
}
exports.PlaylistParser = PlaylistParser;
