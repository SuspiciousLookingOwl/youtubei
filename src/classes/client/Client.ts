import { SearchOptions } from "./types";
import { I_END_POINT, WATCH_END_POINT } from "../../constants";
import { getQueryParameter, http } from "../../common";

import { Playlist, Video, SearchResult } from "..";

export default class YoutubeClient {
	/**
	 * Searches for videos / playlists / channels
	 *
	 * @param {string} query
	 * @param {SearchOptions} searchOptions
	 */
	async search<T extends SearchOptions>(
		query: string,
		searchOptions?: Partial<T>
	): Promise<SearchResult<T>> {
		const options: SearchOptions = {
			type: "all",
			...searchOptions,
		};

		const result = new SearchResult();
		await result.init(query, options);
		return result;
	}

	/**
	 * Get playlist information and its videos by playlist id or URL
	 *
	 * @param playlistIdOrUrl
	 */
	async getPlaylist(playlistIdOrUrl: string): Promise<Playlist | undefined> {
		const playlistId = getQueryParameter(playlistIdOrUrl, "list");

		const response = await http.post(`${I_END_POINT}/browse`, {
			browseId: `VL${playlistId}`,
		});

		if (response.error || response.alerts) return undefined;
		return new Playlist().load(response);
	}

	/**
	 * Get video information by video id or URL
	 *
	 * @param videoIdOrUrl
	 */
	async getVideo(videoIdOrUrl: string): Promise<Video | undefined> {
		const videoId = getQueryParameter(videoIdOrUrl, "v");

		const response = await http.get(`${WATCH_END_POINT}`, { v: videoId, pbj: 1 });

		if (!response[3].response.contents) return undefined;
		return new Video().load(response);
	}
}
