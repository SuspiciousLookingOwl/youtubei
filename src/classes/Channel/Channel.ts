import { YoutubeRawData } from "../../common";
import { BaseChannel, BaseChannelAttributes } from "../BaseChannel";
import { PlaylistCompact } from "../PlaylistCompact";
import { Thumbnails } from "../Thumbnails";
import { VideoCompact } from "../VideoCompact";
import { ChannelParser } from "./ChannelParser";

export interface Shelf {
	title: string;
	subtitle?: string;
	items: BaseChannel[] | VideoCompact[] | PlaylistCompact[];
}

/** @hidden */
interface ChannelAttributes extends BaseChannelAttributes {
	banner: Thumbnails;
	tvBanner: Thumbnails;
	mobileBanner: Thumbnails;
	shelves: Shelf[];
}

/**  Represents a Youtube Channel */
export class Channel extends BaseChannel implements ChannelAttributes {
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
