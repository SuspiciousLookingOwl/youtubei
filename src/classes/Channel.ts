import { http, YoutubeRawData } from "../common";
import { Base, PlaylistCompact, Thumbnails, VideoCompact } from ".";
import { I_END_POINT } from "../constants";

/** @hidden */
interface ChannelAttributes {
	id: string;
	name: string;
	url: string;
	thumbnails: Thumbnails;
	videoCount?: number;
}

/**  Represents a Youtube Channel */
export default class Channel extends Base implements ChannelAttributes {
	/** The channel's ID */
	id!: string;
	/** The channel's name */
	name!: string;
	/** The URL to the channel page */
	url!: string;
	/** Thumbnails of the Channel with different sizes */
	thumbnails!: Thumbnails;
	/** How many video does this channel have */
	videoCount?: number;
	/** Loaded videos on the channel, fetched from `channel.nextVideos()` */
	videos!: VideoCompact[];
	/** Loaded playlists on the channel, fetched from `channel.nextPlaylists()` */
	playlists!: PlaylistCompact[];

	private _videoContinuation?: string | null = null;
	private _playlistContinuation?: string | null = null;

	/** @hidden */
	constructor(channel: Partial<ChannelAttributes> = {}) {
		super();
		Object.assign(this, channel);
	}

	/**
	 * Load next 30 videos made by the channel
	 *
	 * @return New fetched videos
	 */
	async nextVideos(count = 1): Promise<VideoCompact[]> {
		const newVideos: VideoCompact[] = [];
		for (let i = 0; i < count || count == 0; i++) {
			if (this._videoContinuation === undefined) break;

			const items = await this.getTabData("videos");
			this._videoContinuation = Channel.getContinuationFromItems(items);

			newVideos.push(
				...items
					.filter((i: YoutubeRawData) => i.gridVideoRenderer)
					.map((i: YoutubeRawData) => new VideoCompact().load(i.gridVideoRenderer))
			);
		}

		this.videos.push(...newVideos);
		return newVideos;
	}

	/**
	 * Load next 30 playlists made by the channel
	 *
	 * @return New fetched playlists
	 */
	async nextPlaylists(count = 1): Promise<PlaylistCompact[]> {
		const newPlaylists: PlaylistCompact[] = [];
		for (let i = 0; i < count || count == 0; i++) {
			if (this._playlistContinuation === undefined) break;

			const items = await this.getTabData("playlists");
			this._playlistContinuation = Channel.getContinuationFromItems(items);

			newPlaylists.push(
				...items
					.filter((i: YoutubeRawData) => i.gridPlaylistRenderer)
					.map((i: YoutubeRawData) => new PlaylistCompact().load(i.gridPlaylistRenderer))
			);
		}

		this.playlists.push(...newPlaylists);
		return newPlaylists;
	}

	/**
	 * Load instance attributes from youtube raw data
	 *
	 * @param youtubeRawData raw object from youtubei
	 * @hidden
	 */
	load(youtubeRawData: YoutubeRawData): Channel {
		const { channelId, title, thumbnail, videoCountText, navigationEndpoint } = youtubeRawData;
		const { browseId, canonicalBaseUrl } = navigationEndpoint.browseEndpoint;

		this.id = channelId;
		this.name = title.simpleText;
		this.thumbnails = new Thumbnails().load(thumbnail.thumbnails);
		this.url = "https://www.youtube.com" + (canonicalBaseUrl || `/channel/${browseId}`);
		this.videoCount = +videoCountText?.runs[0].text.replace(/[^0-9]/g, "") ?? 0;
		this.videos = [];
		this.playlists = [];

		return this;
	}

	/**
	 * Get tab data from youtube
	 */
	private async getTabData(name: "videos" | "playlists") {
		const params = name === "videos" ? "EgZ2aWRlb3M%3D" : "EglwbGF5bGlzdHMgAQ%3D%3D";
		const continuation =
			name === "videos" ? this._videoContinuation : this._playlistContinuation;

		const response = await http.post(`${I_END_POINT}/browse`, {
			data: { browseId: this.id, params, continuation },
		});

		return Channel.parseTabData(name, response.data);
	}

	/**
	 * Parse tab data from request, tab name is ignored if it's a continuation data
	 */
	private static parseTabData(
		name: "videos" | "playlists",
		data: YoutubeRawData
	): YoutubeRawData {
		const index = name === "videos" ? 1 : 2;
		return (
			data.contents?.twoColumnBrowseResultsRenderer.tabs[index].tabRenderer.content
				.sectionListRenderer.contents[0].itemSectionRenderer.contents[0].gridRenderer
				.items ||
			data.onResponseReceivedActions[0].appendContinuationItemsAction.continuationItems
		);
	}

	/**
	 * Get continuation token from items (if exists)
	 */
	private static getContinuationFromItems(items: YoutubeRawData): string | undefined {
		return items[items.length - 1].continuationItemRenderer?.continuationEndpoint
			.continuationCommand.token;
	}
}
