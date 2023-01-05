import { Shelf, Thumbnails, YoutubeRawData } from "../../common";
import { BaseChannel, BaseChannelProperties } from "../BaseChannel";
import { PlaylistCompact } from "../PlaylistCompact";
import { VideoCompact } from "../VideoCompact";
import { ChannelParser } from "./ChannelParser";

export type ChannelShelf = Shelf<BaseChannel[] | VideoCompact[] | PlaylistCompact[]> & {
	subtitle?: string;
};

/** @hidden */
interface ChannelProperties extends BaseChannelProperties {
	banner?: Thumbnails;
	tvBanner?: Thumbnails;
	mobileBanner?: Thumbnails;
	shelves?: ChannelShelf[];
}

/**  Represents a Youtube Channel */
export class Channel extends BaseChannel implements ChannelProperties {
	banner!: Thumbnails;
	mobileBanner!: Thumbnails;
	tvBanner!: Thumbnails;
	shelves: ChannelShelf[] = [];

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
