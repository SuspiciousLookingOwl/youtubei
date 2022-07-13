import { I_END_POINT } from "../../constants";
import { BaseChannel } from "../BaseChannel";
import { Continuable, ContinuableConstructorParams, FetchReturnType } from "../Continuable";
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

export type SearchResult<T = "all"> = T extends "video" | VideoCompact
	? VideoCompact
	: T extends "channel" | BaseChannel
	? BaseChannel
	: T extends "playlist" | PlaylistCompact
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
export class SearchManager<T = SearchType.ALL> extends Continuable<SearchResult<T>> {
	/** The estimated search result count */
	estimatedResults!: number;

	constructor({ client }: ContinuableConstructorParams) {
		super({ client });
	}

	/**
	 * Initialize data from search
	 *
	 * @param query Search query
	 * @param options Search Options
	 */
	async search(query: string, options: SearchOptions): Promise<SearchManager<T>> {
		this.items = [];
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
			this.items.push(...(data as SearchResult<T>[]));
			this.continuation = continuation;
		}

		return this;
	}

	protected async fetch(): FetchReturnType<SearchResult<T>> {
		const response = await this.client.http.post(`${I_END_POINT}/search`, {
			data: { continuation: this.continuation },
		});

		const { data, continuation } = SearchResultParser.parseContinuationSearchResult(
			response.data,
			this.client
		);

		return {
			items: (data as unknown) as SearchResult<T>[],
			continuation,
		};
	}
}
