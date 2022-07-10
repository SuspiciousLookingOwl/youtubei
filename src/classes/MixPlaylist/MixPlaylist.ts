import { Base, BaseAttributes, MixPlaylistParser, VideoCompact } from "..";
import { YoutubeRawData } from "../../common";

/** @hidden */
interface PlaylistAttributes extends BaseAttributes {
	title: string;
	videoCount: number;
	videos: VideoCompact[];
}

/** Represents a MixPlaylist, usually returned from `client.getPlaylist()` */
export class MixPlaylist extends Base implements PlaylistAttributes {
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
		MixPlaylistParser.loadMixPlaylist(this, data);
		return this;
	}
}
