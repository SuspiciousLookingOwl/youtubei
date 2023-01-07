import { Continuable, ContinuableConstructorParams, FetchResult } from "../Continuable";
import { VideoCompact } from "../VideoCompact";
import { Playlist } from "./Playlist";
declare type ConstructorParams = ContinuableConstructorParams & {
    playlist?: Playlist;
};
/**
 * {@link Continuable} of videos inside a {@link Playlist}
 *
 * @example
 * ```js
 * const playlist = await youtube.getPlaylist(PLAYLIST_ID);
 * console.log(playlist.videos) // first 100 videos
 *
 * let newVideos = await playlist.videos.next();
 * console.log(newVideos) // 100 loaded videos
 * console.log(playlist.videos) // first 200 videos
 *
 * await playlist.videos.next(0); // load the rest of the videos in the playlist
 * ```
 *
 * @param count How many times to load the next videos. Set 0 to load all videos (might take a while on a large playlist!)
 */
export declare class PlaylistVideos extends Continuable<VideoCompact> {
    /** The playlist this videos belongs to */
    playlist?: Playlist;
    /** @hidden */
    constructor({ client, playlist }: ConstructorParams);
    protected fetch(): Promise<FetchResult<VideoCompact>>;
}
export {};
