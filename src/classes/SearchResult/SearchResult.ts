import { extendsBuiltIn } from "../../common";
import { I_END_POINT } from "../../constants";
import { BaseChannel } from "../BaseChannel";
import { Client } from "../Client";
import { PlaylistCompact } from "../PlaylistCompact";
import { VideoCompact } from "../VideoCompact";
import { SearchResultParser } from "./SearchResultParser";
import { SearchProto } from "./proto";

export type SearchOptions = {
	type?: SearchType;
	duration?: SearchDuration;
	uploadDate?: SearchUploadDate;
	sortBy?: SearchSort;
};

export enum SearchUploadDate {
	ALL,
	LAST_HOUR,
	TODAY,
	THIS_WEEK,
	THIS_MONTH,
	THIS_YEAR,
}

export enum SearchType {
	ALL,
	VIDEO,
	CHANNEL,
	PLAYLIST,
}

export enum SearchDuration {
	ALL,
	UNDER_FOUR_MINUTES = 1,
	SHORT = 1,
	FOUR_TO_TWENTY_MINUTES = 3,
	MEDIUM = 3,
	OVER_TWENTY_MINUTES = 2,
	LONG = 2,
}

export enum SearchSort {
	RELEVANCE,
	RATING,
	UPLOAD_DATE,
	VIEW_COUNT,
}

export type SearchResultContent<T extends SearchOptions> = T["type"] extends
	| SearchType.VIDEO
	| VideoCompact
	? VideoCompact
	: T["type"] extends SearchType.CHANNEL | BaseChannel
	? BaseChannel
	: T["type"] extends SearchType.PLAYLIST | PlaylistCompact
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
export class SearchResult<T> extends Array<SearchResultContent<T>> {
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
	async init(query: string, options: SearchOptions): Promise<SearchResult<T>> {
		const { sortBy, ...videoFilters } = options;
		const bufferParams = SearchProto.SearchOptions.encode({
			videoFilters,
			sortBy,
		});

		const response = await this.client.http.post(`${I_END_POINT}/search`, {
			data: {
				query,
				params: Buffer.from(bufferParams).toString("base64"),
			},
		});

		this.estimatedResults = +response.data.estimatedResults;

		if (this.estimatedResults > 0) {
			const { data, continuation } = SearchResultParser.parseInitialSearchResult(
				response.data,
				this.client
			);
			this.push(...(data as SearchResultContent<T>[]));
			this.continuation = continuation;
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
	async next(count = 1): Promise<Array<SearchResultContent<T>>> {
		const newSearchResults = [];
		for (let i = 0; i < count; i++) {
			if (!this.continuation) break;
			const response = await this.client.http.post(`${I_END_POINT}/search`, {
				data: { continuation: this.continuation },
			});

			const { data, continuation } = SearchResultParser.parseContinuationSearchResult(
				response.data,
				this.client
			);
			newSearchResults.push(...(data as SearchResultContent<T>[]));
			this.continuation = continuation;
		}
		this.push(...newSearchResults);
		return newSearchResults;
	}
}
