import { Thumbnails } from ".";
import { YoutubeRawData } from "../common";
import Base from "./Base";
import Channel from "./Channel";

interface PlaylistCompactAttributes {
	id: string;
	title: string;
	thumbnails: Thumbnails;
	channel?: Channel;
	videoCount: number;
}

/**
 * Represent a Compact Playlist (e.g. from search result, upNext / related of a video)
 */
export default class PlaylistCompact extends Base implements PlaylistCompactAttributes {
	title!: string;
	thumbnails!: Thumbnails;
	channel?: Channel;
	videoCount!: number;

	constructor(playlist: Partial<PlaylistCompactAttributes> = {}) {
		super();
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
		this.thumbnails = new Thumbnails().load(thumbnails);

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
