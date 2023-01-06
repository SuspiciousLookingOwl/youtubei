import { stripToInt, Thumbnails, YoutubeRawData } from "../../common";
import { BaseChannel } from "../BaseChannel";
import { PlaylistCompact } from "./PlaylistCompact";

export class PlaylistCompactParser {
	static loadPlaylistCompact(target: PlaylistCompact, data: YoutubeRawData): PlaylistCompact {
		const {
			playlistId,
			title,
			thumbnail,
			shortBylineText,
			videoCount,
			videoCountShortText,
		} = data;

		target.id = playlistId;
		target.title = title.simpleText || title.runs[0].text;
		target.videoCount = stripToInt(videoCount || videoCountShortText.simpleText) || 0;

		// Thumbnail
		target.thumbnails = new Thumbnails().load(
			data.thumbnails?.[0].thumbnails || thumbnail.thumbnails
		);

		// Channel
		if (shortBylineText && shortBylineText.simpleText !== "YouTube") {
			const shortByLine = shortBylineText.runs[0];
			target.channel = new BaseChannel({
				id: shortByLine.navigationEndpoint.browseEndpoint.browseId,
				name: shortByLine.text,
				client: target.client,
			});
		}

		return target;
	}
}
