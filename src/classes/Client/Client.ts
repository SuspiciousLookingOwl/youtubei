import { RequestOptions } from "https";
import { getQueryParameter, HTTP } from "../../common";
import { I_END_POINT, WATCH_END_POINT } from "../../constants";
import { Channel } from "../Channel";
import { LiveVideo } from "../LiveVideo";
import { MixPlaylist } from "../MixPlaylist";
import { Playlist } from "../Playlist";
import { SearchResult, SearchResultType } from "../SearchResult";
import { Video } from "../Video";

// eslint-disable-next-line @typescript-eslint/no-namespace
export namespace ClientTypes {
	export type SearchType = "video" | "channel" | "playlist" | "all";

	export type SearchOptions = {
		/** Search type, can be `"video"`, `"channel"`, `"playlist"`, or `"all"` */
		type?: SearchType;
		/** Raw search params to be passed on the request, ignores `type` value if this is provided */
		params?: string;
	};

	export type ClientOptions = {
		cookie: string;
		/** Optional options for http client */
		requestOptions: Partial<RequestOptions>;
		/** Optional options passed when sending a request to youtube (context.client) */
		youtubeClientOptions: Record<string, unknown>;
		/** Use Node `https` module, set false to use `http` */
		https: boolean;
	};
}

/** Youtube Client */
export class Client {
	/** @hidden */
	http: HTTP;

	constructor(options: Partial<ClientTypes.ClientOptions> = {}) {
		const fullOptions: ClientTypes.ClientOptions = {
			cookie: "",
			https: true,
			requestOptions: {},
			...options,
			youtubeClientOptions: {
				hl: "en",
				gl: "US",
				...options.youtubeClientOptions,
			},
		};

		this.http = new HTTP(fullOptions);
	}

	/**
	 * Searches for videos / playlists / channels
	 *
	 * @param query The search query
	 * @param searchOptions Search options
	 *
	 */
	async search<T extends ClientTypes.SearchOptions>(
		query: string,
		searchOptions?: T
	): Promise<SearchResult<T["type"]>> {
		const options: ClientTypes.SearchOptions = {
			type: "all",
			params: "",
			...searchOptions,
		};

		const result = new SearchResult().load(this);
		await result.init(query, options);
		return result;
	}

	/**
	 * Search for videos / playlists / channels and returns the first result
	 *
	 * @return Can be {@link VideoCompact} | {@link PlaylistCompact} | {@link Channel} | `undefined`
	 */
	async findOne<T extends ClientTypes.SearchOptions>(
		query: string,
		searchOptions?: Partial<T>
	): Promise<SearchResultType<T["type"]> | undefined> {
		return (await this.search(query, searchOptions)).shift();
	}

	/** Get playlist information and its videos by playlist id or URL */
	async getPlaylist<T extends Playlist | MixPlaylist | undefined>(
		playlistIdOrUrl: string
	): Promise<T> {
		const playlistId = getQueryParameter(playlistIdOrUrl, "list");
		if (playlistId.startsWith("RD")) {
			const response = await this.http.post(`${I_END_POINT}/next`, {
				data: { playlistId },
			});

			if (response.data.error) {
				return undefined as T;
			}
			return new MixPlaylist({ client: this }).load(response.data) as T;
		}

		const response = await this.http.post(`${I_END_POINT}/browse`, {
			data: { browseId: `VL${playlistId}` },
		});

		if (response.data.error || response.data.alerts?.shift()?.alertRenderer?.type === "ERROR") {
			return undefined as T;
		}
		return new Playlist({ client: this }).load(response.data) as T;
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
