import { I_END_POINT } from "../../constants";
import { BaseChannel } from "../BaseChannel";
import { Client } from "../Client";
import { PlaylistCompact } from "../PlaylistCompact";
import { VideoCompact } from "../VideoCompact";
import { SearchResultParser } from "./SearchManagerParser";
import { optionsToProto, SearchProto } from "./proto";

export type SearchOptions = {
	type?: SearchType | `${SearchType}`;
	duration?: SearchDuration | `${SearchDuration}`;
	uploadDate?: SearchUploadDate | `${SearchUploadDate}`;
	sortBy?: SearchSort | `${SearchSort}`;
};

export enum SearchUploadDate {
	ALL = "all",
	LAST_HOUR = "hour",
	TODAY = "today",
	THIS_WEEK = "week",
	THIS_MONTH = "month",
	THIS_YEAR = "year",
}

export enum SearchType {
	ALL = "all",
	VIDEO = "video",
	CHANNEL = "channel",
	PLAYLIST = "playlist",
}

export enum SearchDuration {
	ALL = "all",
	UNDER_FOUR_MINUTES = "short",
	SHORT = "short",
	FOUR_TO_TWENTY_MINUTES = "medium",
	MEDIUM = "medium",
	OVER_TWENTY_MINUTES = "long",
	LONG = "long",
}

export enum SearchSort {
	RELEVANCE = "relevance",
	RATING = "rating",
	UPLOAD_DATE = "date",
	VIEW_COUNT = "view",
}

export type SearchResult<T = SearchType.ALL> = T extends SearchType.VIDEO | VideoCompact
	? VideoCompact
	: T extends SearchType.CHANNEL | BaseChannel
	? BaseChannel
	: T extends SearchType.PLAYLIST | PlaylistCompact
	? PlaylistCompact
	: VideoCompact | BaseChannel | PlaylistCompact;

/**
 * Represents search result, usually returned from `client.search();`.
 *
 * {@link SearchManager} is a helper class to manage search result
 *
 * @example
 * ```ts
 * const searchManager = await youtube.search("Keyword");
 *
 * console.log(searchManager.fetched); // search result from first page
 *
 * let nextSearchResult = await SearchManager.next();
 * console.log(nextSearchResult); // search result from second page
 *
 * nextSearchResult = await SearchManager.next();
 * console.log(nextSearchResult); // search result from third page
 *
 * console.log(searchManager.fetched); // search result from first, second, and third page.
 * ```
 *
 * @noInheritDoc
 */
export class SearchManager<T = SearchType.ALL> {
	/** The estimated search result count */
	estimatedResults!: number;
	continuation?: string;
	/** Fetched search result. Gets reset every time {@link SearchManager.search} is called */
	fetched: SearchResult<T>[] = [];

	private client!: Client;

	constructor(client: Client) {
		this.client = client;
	}

	/**
	 * Initialize data from search
	 *
	 * @param query Search query
	 * @param options Search Options
	 */
	async search(query: string, options: SearchOptions): Promise<SearchManager<T>> {
		this.fetched = [];
		this.estimatedResults = 0;

		const bufferParams = SearchProto.SearchOptions.encode(optionsToProto(options));

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
			this.fetched.push(...(data as SearchResult<T>[]));
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
	async next(count = 1): Promise<Array<SearchResult<T>>> {
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
			newSearchResults.push(...(data as SearchResult<T>[]));
			this.continuation = continuation;
		}
		this.fetched.push(...newSearchResults);
		return newSearchResults;
	}
}
