import { axios, YoutubeRawData } from "../common";
import { I_END_POINT } from "../constants";
import Channel from "./Channel";
import VideoCompact from "./VideoCompact";

interface PlaylistAttributes {
	id: string;
	title: string;
	videoCount: number;
	viewCount: number;
	lastUpdatedAt: string;
	channel?: Channel;
	videos: VideoCompact[];
}

/**
 * Represent a Playlist
 */
export default class Playlist implements PlaylistAttributes {
	id!: string;
	title!: string;
	videoCount!: number;
	viewCount!: number;
	lastUpdatedAt!: string;
	channel?: Channel;
	videos!: VideoCompact[];

	constructor(playlist: Partial<Playlist> = {}) {
		Object.assign(this, playlist);
	}

	/**
	 * Load instance attributes from youtube raw data
	 *
	 * @param youtubeRawData raw object from youtubei
	 */
	async load(youtubeRawData: YoutubeRawData, continuationLimit = 0): Promise<Playlist> {
		const sidebarRenderer = youtubeRawData.sidebar.playlistSidebarRenderer.items;
		const primaryRenderer = sidebarRenderer[0].playlistSidebarPrimaryInfoRenderer;

		// Basic information
		this.id = primaryRenderer.title.runs[0].navigationEndpoint.watchEndpoint.playlistId;
		this.title = primaryRenderer.title.runs[0].text;

		const { stats } = primaryRenderer;
		if (primaryRenderer.stats.length === 3) {
			this.videoCount = Playlist.getSideBarInfo(stats[0], true);
			this.viewCount = Playlist.getSideBarInfo(stats[1], true);
			this.lastUpdatedAt = Playlist.getSideBarInfo(stats[2], false);
		} else if (stats.length === 2) {
			this.videoCount = Playlist.getSideBarInfo(stats[0], true);
			this.lastUpdatedAt = Playlist.getSideBarInfo(stats[1], false);
		}

		// Videos
		const playlistContents =
			youtubeRawData.contents.twoColumnBrowseResultsRenderer.tabs[0].tabRenderer.content
				.sectionListRenderer.contents[0].itemSectionRenderer.contents[0]
				.playlistVideoListRenderer.contents;

		const videos = Playlist.getVideos(playlistContents);

		// Video Continuation
		const continuationRenderer = playlistContents[100];
		if (continuationRenderer) {
			const continuationVideos = await Playlist.getVideoContinuation(
				continuationRenderer.continuationItemRenderer.continuationEndpoint
					.continuationCommand.token,
				continuationLimit
			);
			videos.push(...continuationVideos);
		}
		this.videos = videos;

		// Channel
		const videoOwner =
			sidebarRenderer[1]?.playlistSidebarSecondaryInfoRenderer.videoOwner || undefined;
		if (videoOwner) {
			const { title, thumbnail } = videoOwner.videoOwnerRenderer;
			this.channel = new Channel({
				id: title.runs[0].navigationEndpoint.browseEndpoint.browseId,
				name: title.runs[0].text,
				thumbnail: thumbnail.thumbnails[thumbnail.thumbnails.length - 1].url,
				url:
					"https://www.youtube.com" +
					title.runs[0].navigationEndpoint.commandMetadata.webCommandMetadata.url,
			});
		}

		return this;
	}

	/**
	 * Get compact videos
	 *
	 * @param playlistContents raw object from youtubei
	 */
	static getVideos(playlistContents: YoutubeRawData): VideoCompact[] {
		const videosRenderer = playlistContents.map((c: YoutubeRawData) => c.playlistVideoRenderer);
		const videos = [];
		for (const videoRenderer of videosRenderer) {
			if (!videoRenderer) continue;
			videos.push(new VideoCompact().load(videoRenderer));
		}
		return videos;
	}

	/**
	 * Load videos continuation
	 *
	 * @param continuation Continuation token
	 * @param continuationLimit How many continuation
	 */
	static async getVideoContinuation(
		continuation: string,
		continuationLimit = 0,
		continuationCount = 0
	): Promise<VideoCompact[]> {
		continuationCount++;
		if (continuationLimit && continuationCount >= continuationLimit) return [];

		const response = await axios.post(`${I_END_POINT}/browse`, { continuation });

		const playlistContents =
			response.data.onResponseReceivedActions[0].appendContinuationItemsAction
				.continuationItems;

		const videos = Playlist.getVideos(playlistContents);

		const continuationRenderer = playlistContents[100];
		if (continuationRenderer) {
			const continuationVideos = await Playlist.getVideoContinuation(
				continuationRenderer.continuationItemRenderer.continuationEndpoint
					.continuationCommand.token,
				continuationLimit,
				continuationCount
			);
			videos.push(...continuationVideos);
		}

		return videos;
	}

	static getSideBarInfo<T extends true | false = true>(
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
