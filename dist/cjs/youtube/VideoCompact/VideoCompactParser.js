"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.VideoCompactParser = void 0;
const common_1 = require("../../common");
const BaseChannel_1 = require("../BaseChannel");
class VideoCompactParser {
    static loadVideoCompact(target, data) {
        var _a, _b, _c;
        const { videoId, title, headline, lengthText, thumbnail, ownerText, shortBylineText, publishedTimeText, viewCountText, badges, thumbnailOverlays, channelThumbnailSupportedRenderers, detailedMetadataSnippets, } = data;
        target.id = videoId;
        target.title = headline ? headline.simpleText : title.simpleText || ((_a = title.runs[0]) === null || _a === void 0 ? void 0 : _a.text);
        target.thumbnails = new common_1.Thumbnails().load(thumbnail.thumbnails);
        target.uploadDate = publishedTimeText === null || publishedTimeText === void 0 ? void 0 : publishedTimeText.simpleText;
        target.description =
            ((_b = detailedMetadataSnippets === null || detailedMetadataSnippets === void 0 ? void 0 : detailedMetadataSnippets[0].snippetText.runs) === null || _b === void 0 ? void 0 : _b.map((r) => r.text).join("")) || "";
        target.duration =
            common_1.getDuration((lengthText === null || lengthText === void 0 ? void 0 : lengthText.simpleText) || ((_c = thumbnailOverlays === null || thumbnailOverlays === void 0 ? void 0 : thumbnailOverlays[0].thumbnailOverlayTimeStatusRenderer) === null || _c === void 0 ? void 0 : _c.text.simpleText) ||
                "") || null;
        target.isLive = !!((badges === null || badges === void 0 ? void 0 : badges[0].metadataBadgeRenderer.style) === "BADGE_STYLE_TYPE_LIVE_NOW");
        // Channel
        if (ownerText || shortBylineText) {
            const browseEndpoint = (ownerText || shortBylineText).runs[0].navigationEndpoint
                .browseEndpoint;
            if (browseEndpoint) {
                const id = browseEndpoint.browseId;
                const thumbnails = channelThumbnailSupportedRenderers === null || channelThumbnailSupportedRenderers === void 0 ? void 0 : channelThumbnailSupportedRenderers.channelThumbnailWithLinkRenderer.thumbnail.thumbnails;
                target.channel = new BaseChannel_1.BaseChannel({
                    id,
                    name: (ownerText || shortBylineText).runs[0].text,
                    thumbnails: thumbnails ? new common_1.Thumbnails().load(thumbnails) : undefined,
                    client: target.client,
                });
            }
        }
        target.viewCount = common_1.stripToInt((viewCountText === null || viewCountText === void 0 ? void 0 : viewCountText.simpleText) || (viewCountText === null || viewCountText === void 0 ? void 0 : viewCountText.runs[0].text));
        return target;
    }
}
exports.VideoCompactParser = VideoCompactParser;
