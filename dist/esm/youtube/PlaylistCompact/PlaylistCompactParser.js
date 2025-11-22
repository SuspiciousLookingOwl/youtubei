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
    PlaylistCompactParser.loadLockupPlaylistCompact = function (target, data) {
        var _a;
        var lockupMetadataViewModel = data.metadata.lockupMetadataViewModel;
        var channelMetadata = (_a = lockupMetadataViewModel.metadata.contentMetadataViewModel.metadataRows) === null || _a === void 0 ? void 0 : _a[0].metadataParts[0];
        var thumbnailViewModel = data.contentImage.collectionThumbnailViewModel.primaryThumbnail.thumbnailViewModel;
        if (channelMetadata === null || channelMetadata === void 0 ? void 0 : channelMetadata.text.commandRuns) {
            // not a mix
            var channel = new BaseChannel({
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
            stripToInt(thumbnailViewModel.overlays[0].thumbnailOverlayBadgeViewModel.thumbnailBadges[0]
                .thumbnailBadgeViewModel.text) || 0;
        target.thumbnails = new Thumbnails().load(thumbnailViewModel.image.sources);
        return target;
    };
    return PlaylistCompactParser;
}());
export { PlaylistCompactParser };
