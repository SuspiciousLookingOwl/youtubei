import { Thumbnails, YoutubeRawData } from "../../common";
import { Base, BaseProperties } from "../Base";
import { BaseChannelParser } from "./BaseChannelParser";
import { ChannelLive } from "./ChannelLive";
import { ChannelPlaylists } from "./ChannelPlaylists";
import { ChannelPosts } from "./ChannelPosts";
import { ChannelShorts } from "./ChannelShorts";
import { ChannelVideos } from "./ChannelVideos";

/** @hidden */
export interface BaseChannelProperties extends BaseProperties {
	id?: string;
	name?: string;
	thumbnails?: Thumbnails;
	subscriberCount?: string;
}

/**  Represents a Youtube Channel */
export class BaseChannel extends Base implements BaseChannelProperties {
	id!: string;
	/** The channel's name */
	name!: string;
	/** The channel's handle start with @ */
	handle!: string;
	/** The channel's description */
	description?: string;
	/** Thumbnails of this Channel */
	thumbnails?: Thumbnails;
	/**
	 * How many subscriber does this channel have,
	 *
	 * This is not the exact amount, but a literal string like `"1.95M subscribers"`
	 */
	subscriberCount?: string;
	/** Continuable of videos */
	videos: ChannelVideos;
	/** Continuable of shorts */
	shorts: ChannelShorts;
	/** Continuable of live */
	live: ChannelLive;
	/** Continuable of playlists */
	playlists: ChannelPlaylists;
	/** Continuable of posts */
	posts: ChannelPosts;

	/** @hidden */
	constructor(attr: BaseChannelProperties) {
		super(attr.client);
		Object.assign(this, attr);

		this.videos = new ChannelVideos({ channel: this, client: this.client });
		this.shorts = new ChannelShorts({ channel: this, client: this.client });
		this.live = new ChannelLive({ channel: this, client: this.client });
		this.playlists = new ChannelPlaylists({ channel: this, client: this.client });
		this.posts = new ChannelPosts({ channel: this, client: this.client });
	}

	/** The URL of the channel page */
	get url(): string {
		return `https://www.youtube.com/channel/${this.id}`;
	}

	/**
	 * Load this instance with raw data from Youtube
	 *
	 * @hidden
	 */
	load(data: YoutubeRawData): BaseChannel {
		BaseChannelParser.loadBaseChannel(this, data);
		return this;
	}
}
