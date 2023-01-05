export interface Thumbnail {
    url: string;
    width: number;
    height: number;
}
/**
 * Represents Thumbnails, usually found inside Playlist / Channel / Video, etc.
 *
 * {@link Thumbnails} is an array of {@link Thumbnail}
 *
 * @noInheritDoc
 */
export declare class Thumbnails extends Array<Thumbnail> {
    /** @hidden */
    constructor();
    /**
     * Returns thumbnail with the lowest resolution, usually the first element of the Thumbnails array
     *
     * @example
     * ```js
     * const min = video.thumbnails.min;
     * ```
     */
    get min(): string | undefined;
    /**
     * Returns thumbnail with the highest resolution, usually the last element of the Thumbnails array
     *
     * @example
     * ```js
     * const best = video.thumbnails.best;
     * ```
     */
    get best(): string | undefined;
    /**
     * Load this instance with raw data from Youtube
     *
     * @hidden
     */
    load(thumbnails: Thumbnail[]): Thumbnails;
    private static parseThumbnailUrl;
}
