import { I_END_POINT } from "../constants";
import { extendsBuiltIn, YoutubeRawData } from "../common";
import { ChannelCompact, PlaylistCompact, VideoCompact, ClientTypes, Client } from ".";

// eslint-disable-next-line @typescript-eslint/no-namespace
export type SearchResultType<T> = T extends { type: "video" }
	? VideoCompact
	: T extends { type: "channel" }
	? ChannelCompact
	: T extends { type: "playlist" }
	? PlaylistCompact
	: VideoCompact | ChannelCompact | PlaylistCompact;
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
export default class SearchResult<T> extends Array<SearchResultType<T>> {
	/** The estimated search result count */
	estimatedResults!: number;

	private client!: Client;
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
	async init(
		client: Client,
		query: string,
		options: ClientTypes.SearchOptions
	): Promise<SearchResult<T>> {
		this.client = client;
		const response = await this.client.http.post(`${I_END_POINT}/search`, {
			data: { query, params: SearchResult.getSearchTypeParam(options.type) },
		});

		this.estimatedResults = +response.data.estimatedResults;

		if (this.estimatedResults > 0) {
			this.loadSearchResult(
				response.data.contents.twoColumnSearchResultsRenderer.primaryContents
					.sectionListRenderer.contents
			);
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
			if (!this._continuation) break;
			const response = await this.client.http.post(`${I_END_POINT}/search`, {
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
				newContent.push(
					new PlaylistCompact({ client: this.client }).load(content.playlistRenderer)
				);
			else if ("videoRenderer" in content)
				newContent.push(
					new VideoCompact({ client: this.client }).load(content.videoRenderer)
				);
			else if ("channelRenderer" in content)
				newContent.push(
					new ChannelCompact({ client: this.client }).load(content.channelRenderer)
				);
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
