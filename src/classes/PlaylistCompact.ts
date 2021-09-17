import { Thumbnails, BaseAttributes, Base, Playlist, ChannelCompact } from ".";
import { stripToInt, YoutubeRawData } from "../common";

/** @hidden */
interface PlaylistCompactAttributes extends BaseAttributes {
	title: string;
	thumbnails: Thumbnails;
	channel?: ChannelCompact;
	videoCount: number;
}

/** Represents a Compact Playlist (e.g. from search result, upNext / related of a video) */
export default class PlaylistCompact extends Base implements PlaylistCompactAttributes {
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
		const {
			playlistId,
			title,
			thumbnail,
			shortBylineText,
			videoCount,
			videoCountShortText,
		} = data;

		this.id = playlistId;
		this.title = title.simpleText || title.runs[0].text;
		this.videoCount = stripToInt(videoCount || videoCountShortText.simpleText) || 0;

		// Thumbnail
		this.thumbnails = new Thumbnails().load(
			data.thumbnails?.[0].thumbnails || thumbnail.thumbnails
		);

		// Channel
		if (shortBylineText && shortBylineText.simpleText !== "YouTube") {
			const shortByLine = shortBylineText.runs[0];
			this.channel = new ChannelCompact({
				id: shortByLine.navigationEndpoint.browseEndpoint.browseId,
				name: shortByLine.text,
				client: this.client,
			});
		}

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
	async getPlaylist(): Promise<Playlist | undefined> {
		return (await this.client.getPlaylist(this.id)) as Playlist;
	}
}
