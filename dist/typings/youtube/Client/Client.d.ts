import { HTTP, HTTPOptions, OAuthProps } from "../../common";
import { Caption } from "../Caption";
import { Channel } from "../Channel";
import { LiveVideo } from "../LiveVideo";
import { MixPlaylist } from "../MixPlaylist";
import { Playlist } from "../Playlist";
import { SearchOptions, SearchResult, SearchResultItem } from "../SearchResult";
import { Video } from "../Video";
export declare type ClientOptions = HTTPOptions;
/** Youtube Client */
export declare class Client {
    /** @hidden */
    http: HTTP;
    /** @hidden */
    options: HTTPOptions;
    constructor(options?: Partial<ClientOptions>);
    get oauth(): OAuthProps;
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
    /**
     * Get video transcript / caption by video id
     */
    getVideoTranscript(videoId: string, languageCode?: string): Promise<Caption[] | undefined>;
}
