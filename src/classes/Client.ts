import { I_END_POINT, WATCH_END_POINT } from "../constants";
import { getQueryParameter, HTTP } from "../common";

import { Playlist, Video, SearchResult, LiveVideo } from ".";
import { SearchResultType } from "./SearchResult";

// eslint-disable-next-line @typescript-eslint/no-namespace
export namespace Client {
	export type SearchType = "video" | "channel" | "playlist" | "all";

	export type SearchOptions = {
		/** Search type, can be `"video"`, `"channel"`, `"playlist"`, or `"all"` */
		type: SearchType;
	};
}

/** Youtube Client */
export default class Client {
	http: HTTP;

	constructor(cookie = "") {
		this.http = new HTTP(cookie);
	}

	/**
	 * Searches for videos / playlists / channels
	 *
	 * @param query The search query
	 * @param searchOptions Search options
	 *
	 */
	async search<T extends Client.SearchOptions>(
		query: string,
		searchOptions?: Partial<T>
	): Promise<SearchResult<T>> {
		const options: Client.SearchOptions = {
			type: "all",
			...searchOptions,
		};

		const result = new SearchResult();
		await result.init(this, query, options);
		return result;
	}

	/**
	 * Search for videos / playlists / channels and returns the first result
	 *
	 * @return Can be {@link VideoCompact} | {@link PlaylistCompact} | {@link Channel} | `undefined`
	 */
	async findOne<T extends Client.SearchOptions>(
		query: string,
		searchOptions?: Partial<T>
	): Promise<SearchResultType<T> | undefined> {
		return (await this.search(query, searchOptions)).shift();
	}

	/** Get playlist information and its videos by playlist id or URL */
	async getPlaylist(playlistIdOrUrl: string): Promise<Playlist | undefined> {
		const playlistId = getQueryParameter(playlistIdOrUrl, "list");

		const response = await this.http.post(`${I_END_POINT}/browse`, {
			data: { browseId: `VL${playlistId}` },
		});

		if (response.data.error || response.data.alerts) return undefined;
		return new Playlist({ client: this }).load(response.data);
	}

	/** Get video information by video id or URL */
	async getVideo(videoIdOrUrl: string): Promise<Video | LiveVideo | undefined> {
		const videoId = getQueryParameter(videoIdOrUrl, "v");

		const response = await this.http.get(`${WATCH_END_POINT}`, {
			params: { v: videoId, pbj: "1" },
		});

		if (!response.data[3].response.contents) return undefined;
		return !response.data[2].playerResponse.playabilityStatus.liveStreamability
			? new Video({ client: this }).load(response.data)
			: new LiveVideo({ client: this }).load(response.data);
	}
}
