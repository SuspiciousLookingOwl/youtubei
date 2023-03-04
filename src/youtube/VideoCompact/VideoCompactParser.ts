import { getDuration, stripToInt, Thumbnails, YoutubeRawData } from "../../common";
import { BaseChannel } from "../BaseChannel";
import { VideoCompact } from "./VideoCompact";

export class VideoCompactParser {
	static loadVideoCompact(target: VideoCompact, data: YoutubeRawData): VideoCompact {
		const {
			videoId,
			title,
			headline,
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
		target.title = headline ? headline.simpleText : title.simpleText || title.runs[0]?.text;
		target.thumbnails = new Thumbnails().load(thumbnail.thumbnails);
		target.uploadDate = publishedTimeText?.simpleText;
		target.description =
			detailedMetadataSnippets?.[0].snippetText.runs
				?.map((r: YoutubeRawData) => r.text)
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
			const browseEndpoint = (ownerText || shortBylineText).runs[0].navigationEndpoint
				.browseEndpoint;

			if (browseEndpoint) {
				const id = browseEndpoint.browseId;
				const thumbnails =
					channelThumbnailSupportedRenderers?.channelThumbnailWithLinkRenderer.thumbnail
						.thumbnails;

				target.channel = new BaseChannel({
					id,
					name: (ownerText || shortBylineText).runs[0].text,
					thumbnails: thumbnails ? new Thumbnails().load(thumbnails) : undefined,
					client: target.client,
				});
			}
		}

		target.viewCount = stripToInt(viewCountText?.simpleText || viewCountText?.runs[0].text);

		return target;
	}
}
