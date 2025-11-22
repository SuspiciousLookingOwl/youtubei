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
    static loadLockupPlaylistCompact(target, data) {
        var _a;
        const lockupMetadataViewModel = data.metadata.lockupMetadataViewModel;
        const channelMetadata = (_a = lockupMetadataViewModel.metadata.contentMetadataViewModel.metadataRows) === null || _a === void 0 ? void 0 : _a[0].metadataParts[0];
        const thumbnailViewModel = data.contentImage.collectionThumbnailViewModel.primaryThumbnail.thumbnailViewModel;
        if (channelMetadata === null || channelMetadata === void 0 ? void 0 : channelMetadata.text.commandRuns) {
            // not a mix
            const channel = new BaseChannel_1.BaseChannel({
                client: target.client,
                name: channelMetadata.text.content,
                id: channelMetadata.text.commandRuns[0].onTap.innertubeCommand.browseEndpoint
                    .browseId,
            });
            target.channel = channel;
        }
        target.id = data.contentId;
        target.title = lockupMetadataViewModel.title.content;
        target.videoCount =
            common_1.stripToInt(thumbnailViewModel.overlays[0].thumbnailOverlayBadgeViewModel.thumbnailBadges[0]
                .thumbnailBadgeViewModel.text) || 0;
        target.thumbnails = new common_1.Thumbnails().load(thumbnailViewModel.image.sources);
        return target;
    }
}
exports.PlaylistCompactParser = PlaylistCompactParser;
