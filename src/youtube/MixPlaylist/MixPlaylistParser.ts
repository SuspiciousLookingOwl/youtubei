import { YoutubeRawData } from "../../common";
import { Client } from "../Client";
import { VideoCompact } from "../VideoCompact";
import { MixPlaylist } from "./MixPlaylist";

export class MixPlaylistParser {
	static loadMixPlaylist(target: MixPlaylist, data: YoutubeRawData): MixPlaylist {
		const twoColumnWatchNextResults = data.contents.twoColumnWatchNextResults;
		const playlist = twoColumnWatchNextResults.playlist.playlist;
		target.title = playlist.titleText.simpleText;
		target.id = playlist.playlistId;
		target.videoCount = playlist.contents.length;
		target.videos = MixPlaylistParser.parseVideos(playlist.contents, target.client);

		return target;
	}

	private static parseVideos(data: YoutubeRawData, client: Client): VideoCompact[] {
		const videosRenderer = data.map((c: YoutubeRawData) => c.playlistPanelVideoRenderer);

		const videos = [];
		for (const videoRenderer of videosRenderer) {
			if (!videoRenderer) continue;
			const video = new VideoCompact({ client }).load(videoRenderer);
			videos.push(video);
		}
		return videos;
	}
}
