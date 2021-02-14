import { YoutubeRawData } from "../common";
import Channel from "./Channel";

interface PlaylistCompactAttributes {
	title: string;
	thumbnail: string;
	channel?: Channel;
	videoCount: number;
}

/**
 * Represent a Compact Playlist (e.g. from search result, upNext / related of a video)
 */
export default class PlaylistCompact implements PlaylistCompactAttributes {
	id!: string;
	title!: string;
	thumbnail!: string;
	channel?: Channel;
	videoCount!: number;

	constructor(playlist: Partial<PlaylistCompactAttributes> = {}) {
		Object.assign(this, playlist);
	}

	/**
	 * Load instance attributes from youtube raw data
	 *
	 * @param youtubeRawData raw object from youtubei
	 */
	load(youtubeRawData: YoutubeRawData): PlaylistCompact {
		const {
			playlistId,
			title,
			thumbnail,
			shortBylineText,
			videoCount,
			videoCountShortText,
		} = youtubeRawData;

		this.id = playlistId;
		this.title = title.simpleText || title.runs[0].text;
		this.videoCount =
			+(videoCount ?? videoCountShortText.simpleText)?.replace(/[^0-9]/g, "") || 0;

		// Thumbnail
		let { thumbnails } = youtubeRawData;
		if (!thumbnails) thumbnails = thumbnail.thumbnails;
		else thumbnails = thumbnails[0].thumbnails;
		this.thumbnail = thumbnails[thumbnails.length - 1].url;

		// Channel
		if (shortBylineText && shortBylineText.simpleText !== "YouTube") {
			this.channel = new Channel({
				id: shortBylineText.runs[0].navigationEndpoint.browseEndpoint.browseId,
				name: shortBylineText.runs[0].text,
				url: `https://www.youtube.com${shortBylineText.runs[0].navigationEndpoint.commandMetadata.webCommandMetadata.url}`,
			});
		}

		return this;
	}
}
