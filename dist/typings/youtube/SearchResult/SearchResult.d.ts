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
export declare namespace SearchEnum {
    enum UploadDate {
        All = "all",
        Hour = "hour",
        Today = "today",
        Week = "week",
        Month = "month",
        Year = "year"
    }
    enum Type {
        Video = "video",
        Playlist = "playlist",
        Channel = "channel",
        All = "all"
    }
    enum Duration {
        All = "all",
        Short = "short",
        Medium = "medium",
        Long = "long"
    }
    enum Sort {
        Relevance = "relevance",
        Rating = "rating",
        Date = "date",
        View = "view"
    }
    enum Feature {
        Live = "live",
        "4K" = "4k",
        UHD = "4k",
        HD = "hd",
        Subtitles = "subtitles",
        CreativeCommons = "creativeCommons",
        Spherical = "360",
        VR180 = "vr180",
        "3D" = "3d",
        ThreeDimensions = "3d",
        HDR = "hdr",
        Location = "location"
    }
}
export declare type SearchUploadDate = "all" | "hour" | "today" | "week" | "month" | "year" | SearchEnum.UploadDate;
export declare type SearchType = "all" | "video" | "channel" | "playlist" | SearchEnum.Type;
export declare type SearchDuration = "all" | "short" | "medium" | "long" | SearchEnum.Duration;
export declare type SearchSort = "relevance" | "rating" | "date" | "view" | SearchEnum.Sort;
export declare type SearchFeature = "live" | "4k" | "hd" | "subtitles" | "creativeCommons" | "360" | "vr180" | "3d" | "hdr" | "location" | SearchEnum.Feature;
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
