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
import { VideoCompact } from "../VideoCompact";
var MixPlaylistParser = /** @class */ (function () {
    function MixPlaylistParser() {
    }
    MixPlaylistParser.loadMixPlaylist = function (target, data) {
        var twoColumnWatchNextResults = data.contents.twoColumnWatchNextResults;
        var playlist = twoColumnWatchNextResults.playlist.playlist;
        target.title = playlist.titleText.simpleText;
        target.id = playlist.playlistId;
        target.videoCount = playlist.contents.length;
        target.videos = MixPlaylistParser.parseVideos(playlist.contents, target.client);
        return target;
    };
    MixPlaylistParser.parseVideos = function (data, client) {
        var e_1, _a;
        var videosRenderer = data.map(function (c) { return c.playlistPanelVideoRenderer; });
        var videos = [];
        try {
            for (var videosRenderer_1 = __values(videosRenderer), videosRenderer_1_1 = videosRenderer_1.next(); !videosRenderer_1_1.done; videosRenderer_1_1 = videosRenderer_1.next()) {
                var videoRenderer = videosRenderer_1_1.value;
                if (!videoRenderer)
                    continue;
                var video = new VideoCompact({ client: client }).load(videoRenderer);
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
    return MixPlaylistParser;
}());
export { MixPlaylistParser };
