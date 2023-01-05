import { Thumbnails, YoutubeRawData } from "../../common";
import { Base, BaseProperties } from "../Base";
import { BaseChannel } from "../BaseChannel";
import { Playlist } from "../Playlist/Playlist";
import { PlaylistCompactParser } from "./PlaylistCompactParser";

/** @hidden */
interface PlaylistCompactProperties extends BaseProperties {
	id?: string;
	title?: string;
	thumbnails?: Thumbnails;
	channel?: BaseChannel;
	videoCount?: number;
}

/** Represents a Compact Playlist (e.g. from search result, related of a video) */
export class PlaylistCompact extends Base implements PlaylistCompactProperties {
	id!: string;
	/** The playlist's title */
	title!: string;
	/** Thumbnails of the playlist with different sizes */
	thumbnails!: Thumbnails;
	/** The channel that made this playlist */
	channel?: BaseChannel;
	/** How many videos in this playlist */
	videoCount!: number;

	/** @hidden */
	constructor(attr: PlaylistCompactProperties) {
		super(attr.client);
		Object.assign(this, attr);
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
