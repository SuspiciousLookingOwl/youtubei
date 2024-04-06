import { getDuration, stripToInt, Thumbnails } from "../../common";
import { BaseChannel } from "../BaseChannel";
var VideoCompactParser = /** @class */ (function () {
    function VideoCompactParser() {
    }
    VideoCompactParser.loadVideoCompact = function (target, data) {
        var _a, _b, _c, _d, _e;
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
        // Channel
        if (ownerText || shortBylineText) {
            var browseEndpoint = (ownerText || shortBylineText).runs[0].navigationEndpoint
                .browseEndpoint;
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
        }
        target.viewCount = stripToInt((viewCountText === null || viewCountText === void 0 ? void 0 : viewCountText.simpleText) || (viewCountText === null || viewCountText === void 0 ? void 0 : viewCountText.runs[0].text));
        return target;
    };
    return VideoCompactParser;
}());
export { VideoCompactParser };
