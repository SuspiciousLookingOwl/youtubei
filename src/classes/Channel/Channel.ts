import { YoutubeRawData } from "../../common";
import { BaseChannel, BaseChannelProperties } from "../BaseChannel";
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
interface ChannelProperties extends BaseChannelProperties {
	banner?: Thumbnails;
	tvBanner?: Thumbnails;
	mobileBanner?: Thumbnails;
	shelves?: Shelf[];
}

/**  Represents a Youtube Channel */
export class Channel extends BaseChannel implements ChannelProperties {
	banner!: Thumbnails;
	mobileBanner!: Thumbnails;
	tvBanner!: Thumbnails;
	shelves: Shelf[] = [];

	/** @hidden */
	constructor(attr: ChannelProperties) {
		super(attr);
		Object.assign(this, attr);
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
