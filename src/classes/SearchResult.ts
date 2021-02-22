import { SearchOptions } from "./Client";
import { I_END_POINT } from "../constants";
import { http, extendsBuiltIn, YoutubeRawData } from "../common";
import { Channel, PlaylistCompact, VideoCompact } from "..";

export type SearchResultType<T> = T extends { type: "video" }
	? VideoCompact
	: T extends { type: "channel" }
	? Channel
	: T extends { type: "playlist" }
	? PlaylistCompact
	: VideoCompact | Channel | PlaylistCompact;

/**
 * Represents search result, usually returned from `client.search();`
 *
 * @noInheritDoc
 */
@extendsBuiltIn()
export default class SearchResult<T> extends Array<SearchResultType<T>> {
	private _continuation!: string;

	/** @hidden */
	constructor() {
		super();
	}

	/**
	 * Initialize data from search
	 *
	 * @param query Search query
	 * @param options Search Options
	 * @hidden
	 */
	async init(query: string, options: SearchOptions): Promise<SearchResult<T>> {
		const response = await http.post(`${I_END_POINT}/search`, {
			data: { query, params: SearchResult.getSearchTypeParam(options.type) },
		});

		this.loadSearchResult(
			response.data.contents.twoColumnSearchResultsRenderer.primaryContents
				.sectionListRenderer.contents
		);
		return this;
	}

	/**
	 * Load next search data. Youtube returns inconsistent amount of search result, it usually varies from 18 to 20
	 *
	 * Example:
	 * ```js
	 * const videos = await youtube.search("keyword", { type: "video" });
	 * console.log(videos) // first 18-20 videos from the search result
	 *
	 * let newVideos = await videos.next();
	 * console.log(newVideos) // 18-20 loaded videos
	 * console.log(videos) // 36-40 first videos from the search result
	 * ```
	 *
	 * @param count How many times to load the next data
	 */
	async next(count = 1): Promise<Array<SearchResultType<T>>> {
		const newSearchResults = [];
		for (let i = 0; i < count; i++) {
			if (!this._continuation) break;
			const response = await http.post(`${I_END_POINT}/search`, {
				data: { continuation: this._continuation },
			});
			newSearchResults.push(
				...this.loadSearchResult(
					response.data.onResponseReceivedCommands[0].appendContinuationItemsAction
						.continuationItems
				)
			);
		}
		this.push(...newSearchResults);
		return newSearchResults;
	}

	/** Load videos data from youtube */
	private loadSearchResult(sectionListContents: YoutubeRawData): Array<SearchResultType<T>> {
		const contents = sectionListContents
			.filter((c: Record<string, unknown>) => "itemSectionRenderer" in c)
			.pop().itemSectionRenderer.contents;
		const continuationToken = sectionListContents
			.filter((c: Record<string, unknown>) => "continuationItemRenderer" in c)
			.pop().continuationItemRenderer?.continuationEndpoint?.continuationCommand.token;

		this._continuation = continuationToken;
		const newContent = [];

		for (const content of contents) {
			if ("playlistRenderer" in content)
				newContent.push(new PlaylistCompact().load(content.playlistRenderer));
			else if ("videoRenderer" in content)
				newContent.push(new VideoCompact().load(content.videoRenderer));
			else if ("channelRenderer" in content)
				newContent.push(new Channel().load(content.channelRenderer));
		}

		this.push(...(newContent as Array<SearchResultType<T>>));
		return newContent as Array<SearchResultType<T>>;
	}

	/**
	 * Get type query value
	 *
	 * @param type Search type
	 * @hidden
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
