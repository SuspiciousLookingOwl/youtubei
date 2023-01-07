/** @hidden */
interface MusicLyricsProperties {
    content?: string;
    description?: string;
}
/**
 * Represent lyrics of a song
 */
export declare class MusicLyrics implements MusicLyricsProperties {
    /** The lyrics it self */
    content: string;
    /** The lyrics description (usually contains lyrics source) */
    description: string;
    /** @hidden */
    constructor(attr?: MusicLyricsProperties);
}
export {};
