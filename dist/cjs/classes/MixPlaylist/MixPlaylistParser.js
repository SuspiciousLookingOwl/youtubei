"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MixPlaylistParser = void 0;
const VideoCompact_1 = require("../VideoCompact");
class MixPlaylistParser {
    static loadMixPlaylist(target, data) {
        const twoColumnWatchNextResults = data.contents.twoColumnWatchNextResults;
        const playlist = twoColumnWatchNextResults.playlist.playlist;
        target.title = playlist.titleText.simpleText;
        target.id = playlist.playlistId;
        target.videoCount = playlist.contents.length;
        target.videos = MixPlaylistParser.parseVideos(playlist.contents, target.client);
        return target;
    }
    static parseVideos(data, client) {
        const videosRenderer = data.map((c) => c.playlistPanelVideoRenderer);
        const videos = [];
        for (const videoRenderer of videosRenderer) {
            if (!videoRenderer)
                continue;
            const video = new VideoCompact_1.VideoCompact({ client }).load(videoRenderer);
            videos.push(video);
        }
        return videos;
    }
}
exports.MixPlaylistParser = MixPlaylistParser;
