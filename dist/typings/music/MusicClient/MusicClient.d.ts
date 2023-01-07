import { RequestInit } from "node-fetch";
import { HTTP, Shelf } from "../../common";
import { MusicAlbumCompact } from "../MusicAlbumCompact";
import { MusicArtistCompact } from "../MusicArtistCompact";
import { MusicLyrics } from "../MusicLyrics";
import { MusicPlaylistCompact } from "../MusicPlaylistCompact";
import { MusicVideoCompact } from "../MusicVideoCompact";
export declare type MusicClientOptions = {
    initialCookie: string;
    /** Optional options for http client */
    fetchOptions: Partial<RequestInit>;
    /** Optional options passed when sending a request to youtube (context.client) */
    youtubeClientOptions: Record<string, unknown>;
};
/** Youtube Music Client */
export declare class MusicClient {
    /** @hidden */
    http: HTTP;
    constructor(options?: Partial<MusicClientOptions>);
    /**
     * Searches for video, song, album, playlist, or artist
     *
     * @param query The search query
     * @param options Search options
     *
     */
    search(query: string): Promise<Shelf<MusicVideoCompact[] | MusicAlbumCompact[] | MusicPlaylistCompact[] | MusicArtistCompact[]>[]>;
    /**
     * Get lyrics of a song
     *
     * @param query The search query
     * @param options Search options
     *
     */
    getLyrics(id: string): Promise<MusicLyrics | undefined>;
}
