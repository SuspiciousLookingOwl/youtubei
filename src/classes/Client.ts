import { I_END_POINT, WATCH_END_POINT } from "../constants";
import { getQueryParameter, HTTP } from "../common";

import { Playlist, Video, SearchResult, LiveVideo, Channel } from ".";
import { SearchResultType } from "./SearchResult";
import { RequestOptions } from "https";

// eslint-disable-next-line @typescript-eslint/no-namespace
export namespace Client {
	export type SearchType = "video" | "channel" | "playlist" | "all";

	export type SearchOptions = {
		/** Search type, can be `"video"`, `"channel"`, `"playlist"`, or `"all"` */
		type: SearchType;
	};

	export type ClientOptions = {
		cookie: string;
		/** 2-chars language code for localization */
		hl: string;
		/** 2-chars country code  */
		gl: string;
		/** Optional options for http client */
		httpOptions: Partial<RequestOptions>;
		/** Use Node `https` module, set false to use `http` */
		https: boolean;
	};
}

/** Youtube Client */
export default class Client {
	/** @hidden */
	http: HTTP;
	/** @hidden */
	options: Client.ClientOptions;

	constructor(options: Partial<Client.ClientOptions> = {}) {
		this.options = {
			hl: "en",
			gl: "US",
			cookie: "",
			https: true,
			httpOptions: {},
			...options,
		};
		this.http = new HTTP(this, options.httpOptions);
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

		if (response.data.error || response.data.alerts?.shift()?.alertRenderer?.type === "ERROR") {
			return undefined;
		}
		return new Playlist({ client: this }).load(response.data);
	}

	/** Get video information by video id or URL */
	async getVideo<T extends Video | LiveVideo | undefined>(videoIdOrUrl: string): Promise<T> {
		const videoId = getQueryParameter(videoIdOrUrl, "v");

		const response = await this.http.get(`${WATCH_END_POINT}`, {
			params: { v: videoId, pbj: "1" },
		});

		if (!response.data[3].response.contents) return undefined as T;
		return (!response.data[2].playerResponse.playabilityStatus.liveStreamability
			? new Video({ client: this }).load(response.data)
			: new LiveVideo({ client: this }).load(response.data)) as T;
	}

	/** Get channel information by channel id+ */
	async getChannel(channelId: string): Promise<Channel | undefined> {
		const response = await this.http.post(`${I_END_POINT}/browse`, {
			data: { browseId: channelId },
		});

		if (response.data.error || response.data.alerts?.shift()?.alertRenderer?.type === "ERROR") {
			return undefined;
		}
		return new Channel({ client: this }).load(response.data);
	}
}
