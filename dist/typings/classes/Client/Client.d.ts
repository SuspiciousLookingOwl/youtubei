import { RequestInit } from "node-fetch";
import { HTTP } from "../../common";
import { Channel } from "../Channel";
import { LiveVideo } from "../LiveVideo";
import { MixPlaylist } from "../MixPlaylist";
import { Playlist } from "../Playlist";
import { SearchOptions, SearchResult, SearchResultItem } from "../SearchResult";
import { Transcript } from "../Transcript";
import { Video } from "../Video";
export declare type ClientOptions = {
    initialCookie: string;
    /** Optional options for http client */
    fetchOptions: Partial<RequestInit>;
    /** Optional options passed when sending a request to youtube (context.client) */
    youtubeClientOptions: Record<string, unknown>;
};
/** Youtube Client */
export declare class Client {
    /** @hidden */
    http: HTTP;
    constructor(options?: Partial<ClientOptions>);
    /**
     * Searches for videos / playlists / channels
     *
     * @param query The search query
     * @param options Search options
     *
     */
    search<T extends SearchOptions>(query: string, options?: T): Promise<SearchResult<T["type"]>>;
    /**
     * Search for videos / playlists / channels and returns the first result
     *
     * @return Can be {@link VideoCompact} | {@link PlaylistCompact} | {@link BaseChannel} | `undefined`
     */
    findOne<T extends SearchOptions>(query: string, options?: T): Promise<SearchResultItem<T["type"]> | undefined>;
    /** Get playlist information and its videos by playlist id or URL */
    getPlaylist<T extends Playlist | MixPlaylist | undefined>(playlistId: string): Promise<T>;
    /** Get video information by video id or URL */
    getVideo<T extends Video | LiveVideo | undefined>(videoId: string): Promise<T>;
    /** Get channel information by channel id+ */
    getChannel(channelId: string): Promise<Channel | undefined>;
    getVideoTranscript(videoId: string): Promise<Transcript[] | undefined>;
}
