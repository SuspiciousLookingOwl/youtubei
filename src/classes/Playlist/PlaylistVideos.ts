import { Continuable, ContinuableConstructorParams, FetchResult } from "../Continuable";
import { VideoCompact } from "../VideoCompact";
import { I_END_POINT } from "../constants";
import { Playlist } from "./Playlist";
import { PlaylistParser } from "./PlaylistParser";

type ConstructorParams = ContinuableConstructorParams & {
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
export class PlaylistVideos extends Continuable<VideoCompact> {
	/** The playlist this videos belongs to */
	playlist?: Playlist;

	/** @hidden */
	constructor({ client, playlist }: ConstructorParams) {
		super({ client, strictContinuationCheck: true });
		this.playlist = playlist;
	}

	protected async fetch(): Promise<FetchResult<VideoCompact>> {
		const response = await this.client.http.post(`${I_END_POINT}/browse`, {
			data: { continuation: this.continuation },
		});

		const items = PlaylistParser.parseContinuationVideos(response.data, this.client);
		const continuation = PlaylistParser.parseVideoContinuation(response.data);

		return { continuation, items };
	}
}
