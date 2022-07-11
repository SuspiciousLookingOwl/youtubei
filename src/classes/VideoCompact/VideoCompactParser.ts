import { getDuration, stripToInt, YoutubeRawData } from "../../common";
import { BaseChannel } from "../BaseChannel";
import { Thumbnails } from "../Thumbnails";
import { VideoCompact } from "./VideoCompact";

export class VideoCompactParser {
	static loadVideoCompact(target: VideoCompact, data: YoutubeRawData): VideoCompact {
		const {
			videoId,
			title,
			lengthText,
			thumbnail,
			ownerText,
			shortBylineText,
			publishedTimeText,
			viewCountText,
			badges,
			thumbnailOverlays,
			channelThumbnailSupportedRenderers,
			detailedMetadataSnippets,
		} = data;

		target.id = videoId;
		target.title = title.simpleText || title.runs[0]?.text;
		target.thumbnails = new Thumbnails().load(thumbnail.thumbnails);
		target.uploadDate = publishedTimeText?.simpleText;
		target.description =
			detailedMetadataSnippets?.[0].snippetText.runs
				.map((r: YoutubeRawData) => r.text)
				.join("") || "";

		target.duration =
			getDuration(
				lengthText?.simpleText ||
					thumbnailOverlays?.[0].thumbnailOverlayTimeStatusRenderer?.text.simpleText ||
					""
			) || null;

		target.isLive = !!(badges?.[0].metadataBadgeRenderer.style === "BADGE_STYLE_TYPE_LIVE_NOW");

		// Channel
		if (ownerText || shortBylineText) {
			const { browseId } = (
				ownerText || shortBylineText
			).runs[0].navigationEndpoint.browseEndpoint;

			const thumbnails =
				channelThumbnailSupportedRenderers?.channelThumbnailWithLinkRenderer.thumbnail
					.thumbnails;

			target.channel = new BaseChannel({
				id: browseId,
				name: (ownerText || shortBylineText).runs[0].text,
				thumbnails: thumbnails ? new Thumbnails().load(thumbnails) : undefined,
				client: target.client,
			});
		}

		target.viewCount = stripToInt(viewCountText?.simpleText || viewCountText?.runs[0].text);

		return target;
	}
}
