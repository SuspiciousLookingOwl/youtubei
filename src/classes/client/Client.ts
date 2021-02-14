import { GetPlaylistOptions, SearchOptions, SearchType } from "./options";
import { I_END_POINT, WATCH_END_POINT } from "../../constants";
import { getQueryParameter, axios } from "../../common";

import { PlaylistCompact, VideoCompact, Channel, Playlist, Video } from "..";

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
	): Promise<SearchType<T>[]> {
		const options: SearchOptions = {
			type: "all",
			limit: 10,
			...searchOptions,
		};

		const response = await axios.post(`${I_END_POINT}/search`, {
			query,
			params: YoutubeClient.getSearchTypeParam(options.type),
		});

		const contents = response.data.contents.twoColumnSearchResultsRenderer.primaryContents.sectionListRenderer.contents
			.filter((c: Record<string, unknown>) => "itemSectionRenderer" in c)
			.pop().itemSectionRenderer.contents;

		const results = [];

		for (const content of contents) {
			if ("playlistRenderer" in content)
				results.push(new PlaylistCompact().load(content.playlistRenderer));
			else if ("videoRenderer" in content)
				results.push(new VideoCompact().load(content.videoRenderer));
			else if ("channelRenderer" in content)
				results.push(new Channel().load(content.channelRenderer));

			if (results.length >= options.limit) break;
		}

		return results as SearchType<T>[];
	}

	/**
	 * Get playlist information and its videos by playlist id or URL
	 *
	 * @param playlistIdOrUrl
	 */
	async getPlaylist(
		playlistIdOrUrl: string,
		options: Partial<GetPlaylistOptions> = {}
	): Promise<Playlist | undefined> {
		options = {
			continuationLimit: 0,
			...options,
		};

		const playlistId = getQueryParameter(playlistIdOrUrl, "list");

		const response = await axios.post(`${I_END_POINT}/browse`, {
			browseId: `VL${playlistId}`,
		});

		if (response.data.error || response.data.alerts) return undefined;
		return new Playlist().load(response.data, options.continuationLimit);
	}

	/**
	 * Get video information by video id or URL
	 *
	 * @param videoIdOrUrl
	 */
	async getVideo(videoIdOrUrl: string): Promise<Video | undefined> {
		const videoId = getQueryParameter(videoIdOrUrl, "v");

		const response = await axios.get(`${WATCH_END_POINT}`, {
			params: { v: videoId, pbj: 1 },
		});

		if (!response.data[3].response.contents) return undefined;
		return new Video().load(response.data);
	}

	/**
	 * Get type query value
	 *
	 * @param type Search type
	 */
	static getSearchTypeParam(type: "video" | "playlist" | "channel" | "all"): string {
		const searchType = {
			video: "EgIQAQ%3D%3D",
			playlist: "EgIQAw%3D%3D",
			channel: "EgIQAg%3D%3D",
			all: "",
		};
		return type in searchType ? searchType[type] : "";
	}
}
