import { I_END_POINT } from "../../constants";
import { BaseChannel } from "../BaseChannel";
import { Continuable, ContinuableConstructorParams, FetchResult } from "../Continuable";
import { PlaylistCompact } from "../PlaylistCompact";
import { VideoCompact } from "../VideoCompact";
import { SearchResultParser } from "./SearchResultParser";
import { optionsToProto, SearchProto } from "./proto";

export type SearchOptions = {
	type?: SearchType;
	duration?: SearchDuration;
	uploadDate?: SearchUploadDate;
	sortBy?: SearchSort;
};

export type SearchUploadDate = "all" | "hour" | "today" | "week" | "month" | "year";

export type SearchType = "all" | "video" | "channel" | "playlist";

export type SearchDuration = "all" | "short" | "medium" | "long";

export type SearchSort = "relevance" | "rating" | "date" | "view";

export type SearchResultItem<T = "all"> = T extends "video" | VideoCompact
	? VideoCompact
	: T extends "channel" | BaseChannel
	? BaseChannel
	: T extends "playlist" | PlaylistCompact
	? PlaylistCompact
	: VideoCompact | BaseChannel | PlaylistCompact;

/**
 * Represents search result, usually returned from `client.search();`.
 *
 * {@link SearchResult} is a helper class to manage search result
 *
 * @example
 * ```ts
 * const result = await youtube.search("Keyword");
 *
 * console.log(result.items); // search result from first page
 *
 * let nextSearchResult = await result.next();
 * console.log(nextSearchResult); // search result from second page
 *
 * nextSearchResult = await result.next();
 * console.log(nextSearchResult); // search result from third page
 *
 * console.log(result.items); // search result from first, second, and third page.
 * ```
 *
 * @noInheritDoc
 */
export class SearchResult<T extends SearchType | undefined = "all"> extends Continuable<
	SearchResultItem<T>
> {
	/** The estimated search result count */
	estimatedResults!: number;

	/** @hidden */
	constructor({ client }: ContinuableConstructorParams) {
		super({ client });
	}

	/**
	 * Initialize data from search
	 *
	 * @param query Search query
	 * @param options Search Options
	 */
	async search(query: string, options: SearchOptions): Promise<SearchResult<T>> {
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
			this.items.push(...(data as SearchResultItem<T>[]));
			this.continuation = continuation;
		}

		return this;
	}

	protected async fetch(): Promise<FetchResult<SearchResultItem<T>>> {
		const response = await this.client.http.post(`${I_END_POINT}/search`, {
			data: { continuation: this.continuation },
		});

		const { data, continuation } = SearchResultParser.parseContinuationSearchResult(
			response.data,
			this.client
		);

		return {
			items: (data as unknown) as SearchResultItem<T>[],
			continuation,
		};
	}
}
