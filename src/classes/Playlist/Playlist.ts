import { YoutubeRawData } from "../../common";
import { I_END_POINT } from "../../constants";
import { Base, BaseAttributes } from "../Base";
import { BaseChannel, BaseChannelAttributes } from "../BaseChannel";
import { VideoCompact } from "../VideoCompact";
import { PlaylistParser } from "./PlaylistParser";

/** @hidden */
interface PlaylistAttributes extends BaseAttributes {
	title: string;
	videoCount: number;
	viewCount: number;
	lastUpdatedAt: string;
	channel?: BaseChannelAttributes;
	videos: VideoCompact[];
	continuation?: string;
}

/** Represents a Playlist, usually returned from `client.getPlaylist()` */
export class Playlist extends Base implements PlaylistAttributes {
	/** The title of this playlist */
	title!: string;
	/** How many videos in this playlist */
	videoCount!: number;
	/** How many viewers does this playlist have */
	viewCount!: number;
	/** Last time this playlist is updated */
	lastUpdatedAt!: string;
	/** The channel that made this playlist */
	channel?: BaseChannel;
	/** Videos in the playlist */
	videos: VideoCompact[] = [];
	/** Current continuation token to load next videos  */
	continuation!: string | undefined;

	/** @hidden */
	constructor(playlist: Partial<Playlist> = {}) {
		super();
		Object.assign(this, playlist);
	}

	/**
	 * Load this instance with raw data from Youtube
	 *
	 * @hidden
	 */
	load(data: YoutubeRawData): Playlist {
		PlaylistParser.loadPlaylist(this, data);
		return this;
	}

	/**
	 * Load next 100 videos of the playlist, and push the loaded videos to {@link Playlist.videos}
	 *
	 * @example
	 * ```js
	 * const playlist = await youtube.getPlaylist(PLAYLIST_ID);
	 * console.log(playlist.videos) // first 100 videos
	 *
	 * let newVideos = await playlist.next();
	 * console.log(newVideos) // 100 loaded videos
	 * console.log(playlist.videos) // first 200 videos
	 *
	 * await playlist.next(0); // load the rest of the videos in the playlist
	 * ```
	 *
	 * @param count How many times to load the next videos. Set 0 to load all videos (might take a while on a large playlist!)
	 */
	async next(count = 1): Promise<VideoCompact[]> {
		const newVideos: VideoCompact[] = [];
		for (let i = 0; i < count || count == 0; i++) {
			if (!this.continuation) break;
			const response = await this.client.http.post(`${I_END_POINT}/browse`, {
				data: { continuation: this.continuation },
			});

			newVideos.push(...PlaylistParser.parseContinuationVideos(response.data, this.client));
			this.continuation = PlaylistParser.parseVideoContinuation(response.data);
		}

		this.videos.push(...newVideos);
		return newVideos;
	}
}
