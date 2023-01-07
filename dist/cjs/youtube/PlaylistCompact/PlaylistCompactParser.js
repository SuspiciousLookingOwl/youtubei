"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PlaylistCompactParser = void 0;
const common_1 = require("../../common");
const BaseChannel_1 = require("../BaseChannel");
class PlaylistCompactParser {
    static loadPlaylistCompact(target, data) {
        var _a;
        const { playlistId, title, thumbnail, shortBylineText, videoCount, videoCountShortText, } = data;
        target.id = playlistId;
        target.title = title.simpleText || title.runs[0].text;
        target.videoCount = common_1.stripToInt(videoCount || videoCountShortText.simpleText) || 0;
        // Thumbnail
        target.thumbnails = new common_1.Thumbnails().load(((_a = data.thumbnails) === null || _a === void 0 ? void 0 : _a[0].thumbnails) || thumbnail.thumbnails);
        // Channel
        if (shortBylineText && shortBylineText.simpleText !== "YouTube") {
            const shortByLine = shortBylineText.runs[0];
            target.channel = new BaseChannel_1.BaseChannel({
                id: shortByLine.navigationEndpoint.browseEndpoint.browseId,
                name: shortByLine.text,
                client: target.client,
            });
        }
        return target;
    }
}
exports.PlaylistCompactParser = PlaylistCompactParser;
