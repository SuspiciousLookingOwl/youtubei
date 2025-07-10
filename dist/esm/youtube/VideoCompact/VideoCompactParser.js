import { getDuration, stripToInt, Thumbnails } from "../../common";
import { BaseChannel } from "../BaseChannel";
var VideoCompactParser = /** @class */ (function () {
    function VideoCompactParser() {
    }
    VideoCompactParser.loadVideoCompact = function (target, data) {
        var _a, _b, _c, _d, _e, _f, _g, _h, _j;
        var videoId = data.videoId, title = data.title, headline = data.headline, lengthText = data.lengthText, thumbnail = data.thumbnail, ownerText = data.ownerText, shortBylineText = data.shortBylineText, publishedTimeText = data.publishedTimeText, viewCountText = data.viewCountText, badges = data.badges, thumbnailOverlays = data.thumbnailOverlays, channelThumbnailSupportedRenderers = data.channelThumbnailSupportedRenderers, detailedMetadataSnippets = data.detailedMetadataSnippets;
        target.id = videoId;
        target.title = headline
            ? headline.simpleText
            : title.simpleText || ((_b = (_a = title.runs) === null || _a === void 0 ? void 0 : _a[0]) === null || _b === void 0 ? void 0 : _b.text) || "";
        target.thumbnails = new Thumbnails().load(thumbnail.thumbnails);
        target.uploadDate = publishedTimeText === null || publishedTimeText === void 0 ? void 0 : publishedTimeText.simpleText;
        target.description =
            ((_c = detailedMetadataSnippets === null || detailedMetadataSnippets === void 0 ? void 0 : detailedMetadataSnippets[0].snippetText.runs) === null || _c === void 0 ? void 0 : _c.map(function (r) { return r.text; }).join("")) || "";
        target.duration =
            getDuration((lengthText === null || lengthText === void 0 ? void 0 : lengthText.simpleText) || ((_d = thumbnailOverlays === null || thumbnailOverlays === void 0 ? void 0 : thumbnailOverlays[0].thumbnailOverlayTimeStatusRenderer) === null || _d === void 0 ? void 0 : _d.text.simpleText) ||
                "") || null;
        target.isLive =
            !!((badges === null || badges === void 0 ? void 0 : badges[0].metadataBadgeRenderer.style) === "BADGE_STYLE_TYPE_LIVE_NOW") ||
                ((_e = thumbnailOverlays === null || thumbnailOverlays === void 0 ? void 0 : thumbnailOverlays[0].thumbnailOverlayTimeStatusRenderer) === null || _e === void 0 ? void 0 : _e.style) === "LIVE";
        target.isShort =
            ((_f = thumbnailOverlays === null || thumbnailOverlays === void 0 ? void 0 : thumbnailOverlays[0].thumbnailOverlayTimeStatusRenderer) === null || _f === void 0 ? void 0 : _f.style) === "SHORTS" || false;
        // Channel
        var browseEndpoint = (_j = (_h = (_g = (ownerText || shortBylineText)) === null || _g === void 0 ? void 0 : _g.runs[0]) === null || _h === void 0 ? void 0 : _h.navigationEndpoint) === null || _j === void 0 ? void 0 : _j.browseEndpoint;
        if (browseEndpoint) {
            var id = browseEndpoint.browseId;
            var thumbnails = channelThumbnailSupportedRenderers === null || channelThumbnailSupportedRenderers === void 0 ? void 0 : channelThumbnailSupportedRenderers.channelThumbnailWithLinkRenderer.thumbnail.thumbnails;
            target.channel = new BaseChannel({
                id: id,
                name: (ownerText || shortBylineText).runs[0].text,
                thumbnails: thumbnails ? new Thumbnails().load(thumbnails) : undefined,
                client: target.client,
            });
        }
        target.viewCount = stripToInt((viewCountText === null || viewCountText === void 0 ? void 0 : viewCountText.simpleText) || (viewCountText === null || viewCountText === void 0 ? void 0 : viewCountText.runs[0].text));
        return target;
    };
    VideoCompactParser.loadLockupVideoCompact = function (target, data) {
        var _a, _b;
        var lockupMetadataViewModel = data.metadata.lockupMetadataViewModel;
        var decoratedAvatarViewModel = lockupMetadataViewModel.image.decoratedAvatarViewModel;
        var thumbnailBadge = data.contentImage.thumbnailViewModel.overlays[0].thumbnailOverlayBadgeViewModel
            .thumbnailBadges[0].thumbnailBadgeViewModel;
        var metadataRows = lockupMetadataViewModel.metadata.contentMetadataViewModel.metadataRows;
        var channel = new BaseChannel({
            client: target.client,
            name: metadataRows[0].metadataParts[0].text.content,
            id: decoratedAvatarViewModel.rendererContext.commandContext.onTap.innertubeCommand
                .browseEndpoint.browseId,
            thumbnails: new Thumbnails().load(decoratedAvatarViewModel.avatar.avatarViewModel.image.sources),
        });
        var isLive = ((_a = thumbnailBadge.icon) === null || _a === void 0 ? void 0 : _a.sources[0].clientResource.imageName) === "LIVE";
        target.channel = channel;
        target.id = data.contentId;
        target.title = lockupMetadataViewModel.title.content;
        target.isLive = ((_b = thumbnailBadge.icon) === null || _b === void 0 ? void 0 : _b.sources[0].clientResource.imageName) === "LIVE";
        target.duration = !isLive ? getDuration(thumbnailBadge.text) : null;
        target.thumbnails = new Thumbnails().load(data.contentImage.thumbnailViewModel.image.sources);
        target.viewCount = stripToInt(metadataRows[1].metadataParts[0].text.content);
        target.uploadDate = !isLive
            ? metadataRows[1].metadataParts[metadataRows[1].metadataParts.length - 1].text.content
            : undefined;
        return target;
    };
    return VideoCompactParser;
}());
export { VideoCompactParser };
