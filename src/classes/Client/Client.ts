import { RequestInit } from "node-fetch";

import { I_END_POINT, WATCH_END_POINT } from "../../constants";
import { Channel } from "../Channel";
import { LiveVideo } from "../LiveVideo";
import { MixPlaylist } from "../MixPlaylist";
import { Playlist } from "../Playlist";
import { SearchOptions, SearchResult, SearchResultItem } from "../SearchResult";
import { Video } from "../Video";
import { HTTP } from "./HTTP";

export type ClientOptions = {
	initialCookie: string;
	proxy:string;
	/** Optional options for http client */
	fetchOptions: Partial<RequestInit>;
	/** Optional options passed when sending a request to youtube (context.client) */
	youtubeClientOptions: Record<string, unknown>;
};

/** Youtube Client */
export class Client {
	/** @hidden */
	http: HTTP;

	constructor(options: Partial<ClientOptions> = {}) {
		const fullOptions: ClientOptions = {
			initialCookie: "",
			proxy: "",
			fetchOptions: {},
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
	 * @param options Search options
	 *
	 */
	async search<T extends SearchOptions>(
		query: string,
		options?: T
	): Promise<SearchResult<T["type"]>> {
		const result = new SearchResult({ client: this });
		await result.search(query, options || {});
		return result;
	}

	/**
	 * Search for videos / playlists / channels and returns the first result
	 *
	 * @return Can be {@link VideoCompact} | {@link PlaylistCompact} | {@link BaseChannel} | `undefined`
	 */
	async findOne<T extends SearchOptions>(
		query: string,
		options?: T
	): Promise<SearchResultItem<T["type"]> | undefined> {
		const result = await this.search(query, options);
		return result.items[0] || undefined;
	}

	/** Get playlist information and its videos by playlist id or URL */
	async getPlaylist<T extends Playlist | MixPlaylist | undefined>(
		playlistId: string
	): Promise<T> {
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
	async getVideo<T extends Video | LiveVideo | undefined>(videoId: string): Promise<T> {
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
