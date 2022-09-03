import { BaseChannel } from "../BaseChannel";
import { Continuable, ContinuableConstructorParams, FetchResult } from "../Continuable";
import { PlaylistCompact } from "../PlaylistCompact";
import { VideoCompact } from "../VideoCompact";
export declare type SearchOptions = {
    type?: SearchType;
    duration?: SearchDuration;
    uploadDate?: SearchUploadDate;
    sortBy?: SearchSort;
    features?: SearchFeature[];
};
export declare type SearchUploadDate = "all" | "hour" | "today" | "week" | "month" | "year";
export declare type SearchType = "all" | "video" | "channel" | "playlist";
export declare type SearchDuration = "all" | "short" | "medium" | "long";
export declare type SearchSort = "relevance" | "rating" | "date" | "view";
export declare type SearchFeature = "live" | "4k" | "hd" | "subtitles" | "creativeCommons" | "360" | "vr180" | "3d" | "hdr" | "location";
export declare type SearchResultItem<T = "all"> = T extends "video" | VideoCompact ? VideoCompact : T extends "channel" | BaseChannel ? BaseChannel : T extends "playlist" | PlaylistCompact ? PlaylistCompact : VideoCompact | BaseChannel | PlaylistCompact;
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
export declare class SearchResult<T extends SearchType | undefined = "all"> extends Continuable<SearchResultItem<T>> {
    /** The estimated search result count */
    estimatedResults: number;
    /** @hidden */
    constructor({ client }: ContinuableConstructorParams);
    /**
     * Initialize data from search
     *
     * @param query Search query
     * @param options Search Options
     *
     * @hidden
     */
    search(query: string, options: SearchOptions): Promise<SearchResult<T>>;
    protected fetch(): Promise<FetchResult<SearchResultItem<T>>>;
}
