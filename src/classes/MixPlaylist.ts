import { Base, BaseAttributes, VideoCompact } from ".";
import { YoutubeRawData } from "../common";

/** @hidden */
interface PlaylistAttributes extends BaseAttributes {
	title: string;
	videoCount: number;
	videos: VideoCompact[];
}

/** Represents a MixPlaylist, usually returned from `client.getPlaylist()` */

export default class MixPlaylist extends Base implements PlaylistAttributes {
	/** The title of this playlist */
	title!: string;
	/** How many videos in this playlist */
	videoCount!: number;
	/** How many viewers does this playlist have */
	videos: VideoCompact[] = [];

	/** @hidden */
	constructor(playlist: Partial<MixPlaylist> = {}) {
		super();
		Object.assign(this, playlist);
	}

	/**
	 * Load this instance with raw data from Youtube
	 *
	 * @hidden
	 */
	load(data: YoutubeRawData): MixPlaylist {
		const twoColumnWatchNextResults = data.contents.twoColumnWatchNextResults;
		const playlist = twoColumnWatchNextResults.playlist.playlist;
		this.title = playlist.titleText.simpleText;
		this.id = playlist.playlistId;
		this.videoCount = playlist.contents.length;
		this.videos = MixPlaylist.parseVideos(playlist.contents, this);
		return this;
	}

	/**
	 * Get compact videos
	 *
	 * @param MixplaylistContents raw object from youtubei
	 */
	private static parseVideos(
		MixplaylistContents: YoutubeRawData,
		playlist: MixPlaylist
	): VideoCompact[] {
		const videosRenderer = MixplaylistContents.map(
			(c: YoutubeRawData) => c.playlistPanelVideoRenderer
		);
		const videos = [];
		for (const videoRenderer of videosRenderer) {
			if (!videoRenderer) continue;
			const video = new VideoCompact({ client: playlist.client }).load(videoRenderer);
			videos.push(video);
		}
		return videos;
	}
}
