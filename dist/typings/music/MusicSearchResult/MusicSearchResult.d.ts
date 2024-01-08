import { FetchResult, MusicContinuable, MusicContinuableConstructorParams } from "../MusicContinuable";
import { MusicSongCompact } from "../MusicSongCompact";
import { MusicVideoCompact } from "../MusicVideoCompact";
export declare enum MusicSearchTypeEnum {
    Song = "song",
    Video = "video"
}
export declare type MusicSearchType = "song" | "video" | MusicSearchTypeEnum;
export declare type MusicSearchResultItem<T = "song"> = T extends "song" ? MusicSongCompact : MusicVideoCompact;
declare type MusicLyricsProperties = MusicContinuableConstructorParams & {
    type?: MusicSearchType;
};
/**
 * Represents search result, usually returned from `client.search();`.
 *
 * {@link MusicSearchResult} is a helper class to manage search result
 *
 * @example
 * ```ts
 * const result = await music.search("Keyword", "song");
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
export declare class MusicSearchResult<T extends MusicSearchType | undefined = "song"> extends MusicContinuable<MusicSearchResultItem<T>> {
    private type;
    /** @hidden */
    constructor({ client, type }: MusicLyricsProperties);
    /**
     * Initialize data from search
     *
     * @param query Search query
     * @param options Search Options
     *
     * @hidden
     */
    search(query: string, type: MusicSearchType): Promise<MusicSearchResult<T>>;
    protected fetch(): Promise<FetchResult<MusicSearchResultItem<T>>>;
}
export {};
