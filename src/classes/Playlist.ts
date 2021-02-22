import { Thumbnails } from ".";
import { http, YoutubeRawData } from "../common";
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
	private _continuation!: string;

	constructor(playlist: Partial<Playlist> = {}) {
		Object.assign(this, playlist);
	}

	/**
	 * Load instance attributes from youtube raw data
	 *
	 * @param youtubeRawData raw object from youtubei
	 */
	load(youtubeRawData: YoutubeRawData): Playlist {
		const sidebarRenderer = youtubeRawData.sidebar.playlistSidebarRenderer.items;
		const primaryRenderer = sidebarRenderer[0].playlistSidebarPrimaryInfoRenderer;

		// Basic information
		this.id = primaryRenderer.title.runs[0].navigationEndpoint.watchEndpoint.playlistId;
		this.title = primaryRenderer.title.runs[0].text;

		const { stats } = primaryRenderer;
		if (primaryRenderer.stats.length === 3) {
			this.videoCount = this.getSideBarInfo(stats[0], true);
			this.viewCount = this.getSideBarInfo(stats[1], true);
			this.lastUpdatedAt = this.getSideBarInfo(stats[2], false);
		} else if (stats.length === 2) {
			this.videoCount = this.getSideBarInfo(stats[0], true);
			this.lastUpdatedAt = this.getSideBarInfo(stats[1], false);
		}

		// Videos
		const playlistContents =
			youtubeRawData.contents.twoColumnBrowseResultsRenderer.tabs[0].tabRenderer.content
				.sectionListRenderer.contents[0].itemSectionRenderer.contents[0]
				.playlistVideoListRenderer.contents;

		const videos = this.getVideos(playlistContents);

		// Video Continuation Token
		this._continuation =
			playlistContents[100]?.continuationItemRenderer.continuationEndpoint.continuationCommand.token;

		this.videos = videos;

		// Channel
		const videoOwner =
			sidebarRenderer[1]?.playlistSidebarSecondaryInfoRenderer.videoOwner || undefined;
		if (videoOwner) {
			const { title, thumbnail } = videoOwner.videoOwnerRenderer;
			this.channel = new Channel({
				id: title.runs[0].navigationEndpoint.browseEndpoint.browseId,
				name: title.runs[0].text,
				thumbnails: new Thumbnails().load(thumbnail.thumbnails),
				url:
					"https://www.youtube.com" +
					title.runs[0].navigationEndpoint.commandMetadata.webCommandMetadata.url,
			});
		}

		return this;
	}

	/**
	 * Load next videos of the playlist
	 *
	 * @param count How many times to load the next videos. Set 0 to load all videos (might take a while on a large playlist!)
	 */
	async next(count = 1): Promise<VideoCompact[]> {
		const newVideos: VideoCompact[] = [];
		for (let i = 0; i < count || count == 0; i++) {
			if (!this._continuation) break;
			const response = await http.post(`${I_END_POINT}/browse`, {
				data: { continuation: this._continuation },
			});

			const playlistContents =
				response.data.onResponseReceivedActions[0].appendContinuationItemsAction
					.continuationItems;
			newVideos.push(...this.getVideos(playlistContents));

			this._continuation =
				playlistContents[100]?.continuationItemRenderer.continuationEndpoint.continuationCommand.token;
		}

		this.videos.push(...newVideos);
		return newVideos;
	}

	/**
	 * Get compact videos
	 *
	 * @param playlistContents raw object from youtubei
	 */
	private getVideos(playlistContents: YoutubeRawData): VideoCompact[] {
		const videosRenderer = playlistContents.map((c: YoutubeRawData) => c.playlistVideoRenderer);
		const videos = [];
		for (const videoRenderer of videosRenderer) {
			if (!videoRenderer) continue;
			videos.push(new VideoCompact().load(videoRenderer));
		}
		return videos;
	}

	private getSideBarInfo<T extends boolean = true>(
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
