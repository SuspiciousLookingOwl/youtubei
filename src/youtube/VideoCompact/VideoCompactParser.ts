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
		target.title = headline
			? headline.simpleText
			: title.simpleText || title.runs?.[0]?.text || "";
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

		target.isLive =
			!!(badges?.[0].metadataBadgeRenderer.style === "BADGE_STYLE_TYPE_LIVE_NOW") ||
			thumbnailOverlays?.[0].thumbnailOverlayTimeStatusRenderer?.style === "LIVE";

		target.isShort =
			thumbnailOverlays?.[0].thumbnailOverlayTimeStatusRenderer?.style === "SHORTS" || false;

		// Channel
		const browseEndpoint = (ownerText || shortBylineText)?.runs[0]?.navigationEndpoint
			?.browseEndpoint;

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

		target.viewCount = stripToInt(viewCountText?.simpleText || viewCountText?.runs[0].text);

		return target;
	}

	static loadLockupVideoCompact(target: VideoCompact, data: YoutubeRawData): VideoCompact {
		const lockupMetadataViewModel = data.metadata.lockupMetadataViewModel;
		const decoratedAvatarViewModel = lockupMetadataViewModel.image.decoratedAvatarViewModel;
		const thumbnailBadge =
			data.contentImage.thumbnailViewModel.overlays[0].thumbnailOverlayBadgeViewModel
				.thumbnailBadges[0].thumbnailBadgeViewModel;
		const metadataRows = lockupMetadataViewModel.metadata.contentMetadataViewModel.metadataRows;

		const channel = new BaseChannel({
			client: target.client,
			name: metadataRows?.[0]?.metadataParts?.[0]?.text?.content,
			id:
				decoratedAvatarViewModel.rendererContext.commandContext.onTap.innertubeCommand
					.browseEndpoint.browseId,
			thumbnails: new Thumbnails().load(
				decoratedAvatarViewModel.avatar.avatarViewModel.image.sources
			),
		});

		const isLive = thumbnailBadge.icon?.sources?.[0]?.clientResource?.imageName === "LIVE";

		target.channel = channel;
		target.id = data.contentId;
		target.title = lockupMetadataViewModel.title.content;
		target.isLive = thumbnailBadge.icon?.sources[0].clientResource.imageName === "LIVE";
		target.duration = !isLive ? getDuration(thumbnailBadge.text) : null;
		target.thumbnails = new Thumbnails().load(
			data.contentImage.thumbnailViewModel.image.sources
		);
		target.viewCount = stripToInt(metadataRows?.[1]?.metadataParts?.[0]?.text?.content);
		target.uploadDate = !isLive
			? metadataRows?.[1]?.metadataParts?.[metadataRows?.[1]?.metadataParts?.length - 1]?.text?.content
			: undefined;

		return target;
	}
}
