import { stripToInt, Thumbnails, YoutubeRawData } from "../../common";
import { BaseChannel } from "../BaseChannel";
import { PlaylistCompact } from "./PlaylistCompact";

export class PlaylistCompactParser {
	static loadPlaylistCompact(target: PlaylistCompact, data: YoutubeRawData): PlaylistCompact {
		const {
			playlistId,
			title,
			thumbnail,
			shortBylineText,
			videoCount,
			videoCountShortText,
		} = data;

		target.id = playlistId;
		target.title = title.simpleText || title.runs[0].text;
		target.videoCount = stripToInt(videoCount || videoCountShortText.simpleText) || 0;

		// Thumbnail
		target.thumbnails = new Thumbnails().load(
			data.thumbnails?.[0].thumbnails || thumbnail.thumbnails
		);

		// Channel
		if (shortBylineText && shortBylineText.simpleText !== "YouTube") {
			const shortByLine = shortBylineText.runs[0];
			target.channel = new BaseChannel({
				id: shortByLine.navigationEndpoint.browseEndpoint.browseId,
				name: shortByLine.text,
				client: target.client,
			});
		}

		return target;
	}

	static loadLockupPlaylistCompact(
		target: PlaylistCompact,
		data: YoutubeRawData
	): PlaylistCompact {
		const lockupMetadataViewModel = data.metadata.lockupMetadataViewModel;
		const channelMetadata =
			lockupMetadataViewModel.metadata.contentMetadataViewModel.metadataRows?.[0]
				.metadataParts[0];
		const thumbnailViewModel =
			data.contentImage.collectionThumbnailViewModel.primaryThumbnail.thumbnailViewModel;

		if (channelMetadata?.text.commandRuns) {
			// not a mix
			const channel = new BaseChannel({
				client: target.client,
				name: channelMetadata.text.content,
				id:
					channelMetadata.text.commandRuns[0].onTap.innertubeCommand.browseEndpoint
						.browseId,
			});

			target.channel = channel;
		}

		target.id = data.contentId;
		target.title = lockupMetadataViewModel.title.content;
		target.videoCount =
			stripToInt(
				thumbnailViewModel.overlays[0].thumbnailOverlayBadgeViewModel.thumbnailBadges[0]
					.thumbnailBadgeViewModel.text
			) || 0;
		target.thumbnails = new Thumbnails().load(thumbnailViewModel.image.sources);

		return target;
	}
}
