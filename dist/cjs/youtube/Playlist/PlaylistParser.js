"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PlaylistParser = void 0;
const common_1 = require("../../common");
const BaseChannel_1 = require("../BaseChannel");
const VideoCompact_1 = require("../VideoCompact");
class PlaylistParser {
    static loadPlaylist(target, data) {
        var _a, _b;
        const sidebarRenderer = data.sidebar.playlistSidebarRenderer.items;
        const primaryRenderer = sidebarRenderer[0].playlistSidebarPrimaryInfoRenderer;
        const metadata = data.metadata.playlistMetadataRenderer;
        // Basic information
        target.id = (_a = Object.values(metadata)
            .find((v) => v.includes("playlist?list="))) === null || _a === void 0 ? void 0 : _a.split("=")[1];
        target.title = metadata.title;
        const { playlistVideoThumbnailRenderer, playlistCustomThumbnailRenderer, } = primaryRenderer.thumbnailRenderer;
        target.thumbnails = new common_1.Thumbnails().load((playlistVideoThumbnailRenderer || playlistCustomThumbnailRenderer).thumbnail.thumbnails);
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
        const playlistContents = data.contents.twoColumnBrowseResultsRenderer.tabs[0].tabRenderer.content
            .sectionListRenderer.contents[0].itemSectionRenderer.contents || [];
        // Channel
        const videoOwner = (_b = sidebarRenderer[1]) === null || _b === void 0 ? void 0 : _b.playlistSidebarSecondaryInfoRenderer.videoOwner;
        if (videoOwner === null || videoOwner === void 0 ? void 0 : videoOwner.videoOwnerRenderer.title.runs) {
            const { title, thumbnail } = videoOwner.videoOwnerRenderer;
            target.channel = new BaseChannel_1.BaseChannel({
                id: title.runs[0].navigationEndpoint.browseEndpoint.browseId,
                name: title.runs[0].text,
                thumbnails: new common_1.Thumbnails().load(thumbnail.thumbnails),
                client: target.client,
            });
        }
        const playlistContentRenderer = playlistContents[0].playlistVideoListRenderer
            ? playlistContents[0].playlistVideoListRenderer.contents
            : playlistContents;
        // Videos
        target.videos.items = PlaylistParser.parseVideos(playlistContentRenderer, target);
        target.videos.continuation = common_1.getContinuationFromItems(playlistContentRenderer);
        return target;
    }
    static parseVideoContinuation(data) {
        const playlistContents = data.onResponseReceivedActions[0].appendContinuationItemsAction.continuationItems;
        return common_1.getContinuationFromItems(playlistContents);
    }
    static parseContinuationVideos(data, client) {
        const playlistContents = data.onResponseReceivedActions[0].appendContinuationItemsAction.continuationItems;
        const videos = common_1.mapFilter(playlistContents, "lockupViewModel");
        return videos.map((video) => new VideoCompact_1.VideoCompact({ client }).loadLockup(video));
    }
    /**
     * Get compact videos
     *
     * @param playlistContents raw object from youtubei
     */
    static parseVideos(playlistContents, playlist) {
        const videos = [];
        for (const content of playlistContents) {
            let video;
            if (content.lockupViewModel) {
                video = new VideoCompact_1.VideoCompact({ client: playlist.client }).loadLockup(content.lockupViewModel);
            }
            else if (content.playlistVideoRenderer) {
                video = new VideoCompact_1.VideoCompact({ client: playlist.client }).load(content.playlistVideoRenderer);
            }
            if (!video)
                continue;
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
