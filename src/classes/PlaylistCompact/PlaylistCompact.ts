import { Base, BaseAttributes, ChannelCompact, Playlist, Thumbnails } from "../..";
import { YoutubeRawData } from "../../common";
import { PlaylistCompactParser } from "./PlaylistCompactParser";

/** @hidden */
interface PlaylistCompactAttributes extends BaseAttributes {
	title: string;
	thumbnails: Thumbnails;
	channel?: ChannelCompact;
	videoCount: number;
}

/** Represents a Compact Playlist (e.g. from search result, related of a video) */
export class PlaylistCompact extends Base implements PlaylistCompactAttributes {
	/** The playlist's title */
	title!: string;
	/** Thumbnails of the playlist with different sizes */
	thumbnails!: Thumbnails;
	/** The channel that made this playlist */
	channel?: ChannelCompact;
	/** How many videos in this playlist */
	videoCount!: number;

	/** @hidden */
	constructor(playlist: Partial<PlaylistCompactAttributes> = {}) {
		super();
		Object.assign(this, playlist);
	}

	/**
	 * Load this instance with raw data from Youtube
	 *
	 * @hidden
	 */
	load(data: YoutubeRawData): PlaylistCompact {
		PlaylistCompactParser.loadPlaylistCompact(this, data);
		return this;
	}

	/**
	 * Get {@link Playlist} object based on current playlist id
	 *
	 * Equivalent to
	 * ```js
	 * client.getPlaylist(playlistCompact.id);
	 * ```
	 */
	async getPlaylist(): Promise<Playlist> {
		return await this.client.getPlaylist(this.id);
	}
}
