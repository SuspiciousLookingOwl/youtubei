import {
	ChannelCompact,
	ChannelCompactAttributes,
	PlaylistCompact,
	Thumbnails,
	VideoCompact,
} from "..";
import { YoutubeRawData } from "../../common";
import { ChannelParser } from "./ChannelParser";

export interface Shelf {
	title: string;
	subtitle?: string;
	items: ChannelCompact[] | VideoCompact[] | PlaylistCompact[];
}

/** @hidden */
interface ChannelAttributes extends ChannelCompactAttributes {
	banner: Thumbnails;
	tvBanner: Thumbnails;
	mobileBanner: Thumbnails;
	shelves: Shelf[];
}

/**  Represents a Youtube Channel */
export class Channel extends ChannelCompact implements ChannelAttributes {
	banner!: Thumbnails;
	mobileBanner!: Thumbnails;
	tvBanner!: Thumbnails;
	shelves: Shelf[] = [];

	/** @hidden */
	constructor(channel: Partial<ChannelAttributes> = {}) {
		super();
		this.videos = [];
		this.playlists = [];
		Object.assign(this, channel);
	}

	/**
	 * Load this instance with raw data from Youtube
	 *
	 * @hidden
	 */
	load(data: YoutubeRawData): Channel {
		ChannelParser.loadChannel(this, data);
		return this;
	}
}
