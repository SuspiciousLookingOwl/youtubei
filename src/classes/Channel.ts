import { http, Thumbnail, YoutubeRawData } from "../common";
import { Base, PlaylistCompact, VideoCompact } from ".";
import { I_END_POINT } from "../constants";

interface ChannelProperties {
	id: string;
	name: string;
	url: string;
	thumbnails: Thumbnail[];
	videoCount?: number;
}

/**
 * Represent a Youtube Channel
 */
export default class Channel extends Base implements ChannelProperties {
	name!: string;
	url!: string;
	videoCount?: number;

	constructor(channel: Partial<ChannelProperties> = {}) {
		super();
		Object.assign(this, channel);
	}

	/**
	 * Get videos from current Channel
	 *
	 * TODO: Add continuation support
	 */
	async getVideos(): Promise<VideoCompact[]> {
		const response = await http.post(`${I_END_POINT}/browse`, {
			browseId: this.id,
			params: "EgZ2aWRlb3M%3D",
		});

		return response.contents.twoColumnBrowseResultsRenderer.tabs[1].tabRenderer.content.sectionListRenderer.contents[0].itemSectionRenderer.contents[0].gridRenderer.items
			.filter((i: YoutubeRawData) => i.gridVideoRenderer)
			.map((i: YoutubeRawData) => new VideoCompact().load(i.gridVideoRenderer));
	}

	/**
	 * Get playlists from current channel
	 *
	 * TODO: Add continuation support
	 */
	async getPlaylists(): Promise<PlaylistCompact[]> {
		const response = await http.post(`${I_END_POINT}/browse`, {
			browseId: this.id,
			params: "EglwbGF5bGlzdHM%3D",
		});

		const section =
			response.contents.twoColumnBrowseResultsRenderer.tabs[2].tabRenderer.content
				.sectionListRenderer;

		let gridPlaylistRenderer;

		// Has category
		if ("shelfRenderer" in section.contents[0].itemSectionRenderer.contents[0]) {
			gridPlaylistRenderer = section.contents
				.map(
					(c: YoutubeRawData) =>
						c.itemSectionRenderer.contents[0].shelfRenderer.content
							.horizontalListRenderer.items
				)
				.flat();
		} else {
			gridPlaylistRenderer =
				section.contents[0].itemSectionRenderer.contents[0].gridRenderer.items;
		}

		return gridPlaylistRenderer.map((i: YoutubeRawData) =>
			new PlaylistCompact().load(i.gridPlaylistRenderer)
		);
	}

	/**
	 * Load instance attributes from youtube raw data
	 *
	 * @param youtubeRawData raw object from youtubei
	 */
	load(youtubeRawData: YoutubeRawData): Channel {
		const { channelId, title, thumbnail, videoCountText, navigationEndpoint } = youtubeRawData;

		const { browseId, canonicalBaseUrl } = navigationEndpoint.browseEndpoint;

		this.id = channelId;
		this.name = title.simpleText;
		this.thumbnails = thumbnail.thumbnails;
		this.url = "https://www.youtube.com" + (canonicalBaseUrl || `/channel/${browseId}`);
		this.videoCount = +videoCountText?.runs[0].text.replace(/[^0-9]/g, "") ?? 0;

		return this;
	}
}
