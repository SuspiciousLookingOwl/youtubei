import { YoutubeRawData } from "../../common";
import { Base, BaseProperties } from "../Base";
import { VideoCompact } from "../VideoCompact";
import { MixPlaylistParser } from "./MixPlaylistParser";

/** @hidden */
interface MixPlaylistProperties extends BaseProperties {
	id?: string;
	title?: string;
	videoCount?: number;
	videos?: VideoCompact[];
}

/** Represents a MixPlaylist, usually returned from `client.getPlaylist()` */
export class MixPlaylist extends Base implements MixPlaylistProperties {
	id!: string;
	/** The title of this playlist */
	title!: string;
	/** How many videos in this playlist */
	videoCount!: number;
	/** How many viewers does this playlist have */
	videos: VideoCompact[] = [];

	/** @hidden */
	constructor(attr: MixPlaylistProperties) {
		super(attr.client);
		Object.assign(this, attr);
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
