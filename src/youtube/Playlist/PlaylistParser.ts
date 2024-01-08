import { getContinuationFromItems, mapFilter, Thumbnails, YoutubeRawData } from "../../common";
import { BaseChannel } from "../BaseChannel";
import { Client } from "../Client";
import { VideoCompact } from "../VideoCompact";
import { Playlist } from "./Playlist";

export class PlaylistParser {
	static loadPlaylist(target: Playlist, data: YoutubeRawData): Playlist {
		const sidebarRenderer = data.sidebar.playlistSidebarRenderer.items;
		const primaryRenderer = sidebarRenderer[0].playlistSidebarPrimaryInfoRenderer;
		const metadata = data.metadata.playlistMetadataRenderer;

		// Basic information
		target.id = Object.values<string>(metadata)
			.find((v) => v.includes("playlist?list="))
			?.split("=")[1] as string;
		target.title = metadata.title;

		const {
			playlistVideoThumbnailRenderer,
			playlistCustomThumbnailRenderer,
		} = primaryRenderer.thumbnailRenderer;

		target.thumbnails = new Thumbnails().load(
			(playlistVideoThumbnailRenderer || playlistCustomThumbnailRenderer).thumbnail.thumbnails
		);

		const { stats } = primaryRenderer;
		if (primaryRenderer.stats.length === 3) {
			target.videoCount = PlaylistParser.parseSideBarInfo(stats[0], true);
			target.viewCount = PlaylistParser.parseSideBarInfo(stats[1], true);
			target.lastUpdatedAt = PlaylistParser.parseSideBarInfo(stats[2], false);
		} else if (stats.length === 2) {
			target.videoCount = PlaylistParser.parseSideBarInfo(stats[0], true);
			target.lastUpdatedAt = PlaylistParser.parseSideBarInfo(stats[1], false);
		}

		const playlistContents =
			data.contents.twoColumnBrowseResultsRenderer.tabs[0].tabRenderer.content
				.sectionListRenderer.contents[0].itemSectionRenderer.contents[0]
				.playlistVideoListRenderer?.contents || [];

		// Channel
		const videoOwner = sidebarRenderer[1]?.playlistSidebarSecondaryInfoRenderer.videoOwner;
		if (videoOwner) {
			const { title, thumbnail } = videoOwner.videoOwnerRenderer;
			target.channel = new BaseChannel({
				id: title.runs[0].navigationEndpoint.browseEndpoint.browseId,
				name: title.runs[0].text,
				thumbnails: new Thumbnails().load(thumbnail.thumbnails),
				client: target.client,
			});
		}

		// Videos
		target.videos.items = PlaylistParser.parseVideos(playlistContents, target);
		target.videos.continuation = getContinuationFromItems(playlistContents);

		return target;
	}

	static parseVideoContinuation(data: YoutubeRawData): string | undefined {
		const playlistContents =
			data.onResponseReceivedActions[0].appendContinuationItemsAction.continuationItems;

		return getContinuationFromItems(playlistContents);
	}

	static parseContinuationVideos(data: YoutubeRawData, client: Client): VideoCompact[] {
		const playlistContents =
			data.onResponseReceivedActions[0].appendContinuationItemsAction.continuationItems;

		const videos = mapFilter(playlistContents, "playlistVideoRenderer");

		return videos.map((video: YoutubeRawData) => new VideoCompact({ client }).load(video));
	}

	/**
	 * Get compact videos
	 *
	 * @param playlistContents raw object from youtubei
	 */
	private static parseVideos(
		playlistContents: YoutubeRawData,
		playlist: Playlist
	): VideoCompact[] {
		const videosRenderer = playlistContents.map((c: YoutubeRawData) => c.playlistVideoRenderer);
		const videos = [];
		for (const videoRenderer of videosRenderer) {
			if (!videoRenderer) continue;
			const video = new VideoCompact({ client: playlist.client }).load(videoRenderer);
			videos.push(video);
		}
		return videos;
	}

	private static parseSideBarInfo<T extends boolean = true>(
		stats: YoutubeRawData,
		parseInt: T
	): T extends true ? number : string {
		let data;
		if ("runs" in stats) data = stats.runs.map((r: Record<string, string>) => r.text).join("");
		else data = stats.simpleText.replace(/[^0-9]/g, "");

		if (parseInt) data = +data.replace(/[^0-9]/g, "");
		return data;
	}
}
