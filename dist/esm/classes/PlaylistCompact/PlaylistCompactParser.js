import { stripToInt, Thumbnails } from "../../common";
import { BaseChannel } from "../BaseChannel";
var PlaylistCompactParser = /** @class */ (function () {
    function PlaylistCompactParser() {
    }
    PlaylistCompactParser.loadPlaylistCompact = function (target, data) {
        var _a;
        var playlistId = data.playlistId, title = data.title, thumbnail = data.thumbnail, shortBylineText = data.shortBylineText, videoCount = data.videoCount, videoCountShortText = data.videoCountShortText;
        target.id = playlistId;
        target.title = title.simpleText || title.runs[0].text;
        target.videoCount = stripToInt(videoCount || videoCountShortText.simpleText) || 0;
        // Thumbnail
        target.thumbnails = new Thumbnails().load(((_a = data.thumbnails) === null || _a === void 0 ? void 0 : _a[0].thumbnails) || thumbnail.thumbnails);
        // Channel
        if (shortBylineText && shortBylineText.simpleText !== "YouTube") {
            var shortByLine = shortBylineText.runs[0];
            target.channel = new BaseChannel({
                id: shortByLine.navigationEndpoint.browseEndpoint.browseId,
                name: shortByLine.text,
                client: target.client,
            });
        }
        return target;
    };
    return PlaylistCompactParser;
}());
export { PlaylistCompactParser };
