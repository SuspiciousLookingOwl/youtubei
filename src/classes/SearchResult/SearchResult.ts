
import { extendsBuiltIn } from "../../common";
import { I_END_POINT } from "../../constants";
import { BaseChannel } from "../BaseChannel";
import { Client } from "../Client";
import { PlaylistCompact } from "../PlaylistCompact";
import { VideoCompact } from "../VideoCompact";
import { SearchResultParser } from "./SearchResultParser";

// eslint-disable-next-line @typescript-eslint/no-namespace
export type SearchResultType<T = unknown> = T extends "video" | VideoCompact
	? VideoCompact
	: T extends "channel" | BaseChannel
	? BaseChannel
	: T extends "playlist" | PlaylistCompact
	? PlaylistCompact
	: VideoCompact | BaseChannel | PlaylistCompact;
/**
 * Represents search result, usually returned from `client.search();`.
 *
 * {@link SearchResult} is a subclass of [Array](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array)
 * with {@link SearchResult.next} method to navigate through pagination
 *
 * @example
 * ```ts
 * const searchResult = await youtube.search("Keyword");
 *
 * console.log(searchResult); // search result from first page
 *
 * let nextSearchResult = await searchResult.next();
 * console.log(nextSearchResult); // search result from second page
 *
 * nextSearchResult = await searchResult.next();
 * console.log(nextSearchResult); // search result from third page
 *
 * console.log(searchResult); // search result from first, second, and third page.
 * ```
 *
 * @noInheritDoc
 */
@extendsBuiltIn()
export class SearchResult<T> extends Array<SearchResultType<T>> {
	/** The estimated search result count */
	estimatedResults!: number;
	continuation?: string;

	private client!: Client;

	/** @hidden */
	constructor() {
		super();
	}

	/**
	 * Load this instance
	 *
	 * @hidden
	 */
	load(client: Client): SearchResult<T> {
		this.client = client;
		return this;
	}

	/**
	 * Initialize data from search
	 *
	 * @param query Search query
	 * @param options Search Options
	 * @hidden
	 */
	async init(query: string, options: Client.SearchOptions): Promise<SearchResult<T>> {
		const response = await this.client.http.post(`${I_END_POINT}/search`, {
			data: {
				query,
				params: options.params || SearchResult.getSearchTypeParam(options.type || "all"),
			},
		});

		this.estimatedResults = +response.data.estimatedResults;

		if (this.estimatedResults > 0) {
			const items = SearchResultParser.parseInitialSearchResult(response.data, this.client) as SearchResultType<T>[];
			this.push(...items);
			this.continuation = SearchResultParser.parseInitialContinuation(response.data);
		}

		return this;
	}

	/**
	 * Load next search data. Youtube returns inconsistent amount of search result, it usually varies from 18 to 20
	 *
	 * @example
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
			if (!this.continuation) break;
			const response = await this.client.http.post(`${I_END_POINT}/search`, {
				data: { continuation: this.continuation },
			});

			const items = SearchResultParser.parseContinuationSearchResult(response.data, this.client) as SearchResultType<T>[];
			newSearchResults.push(...items);
			this.continuation = SearchResultParser.parseContinuation(response.data);
		}
		this.push(...newSearchResults);
		return newSearchResults;
	}

	/** Load videos data from youtube */

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
