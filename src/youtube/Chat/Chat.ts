import { YoutubeRawData } from "../../common";
import { Base, BaseProperties } from "../Base";
import { BaseChannel } from "../BaseChannel";
import { Video } from "../Video";
import { ChatParser } from "./ChatParser";

/** @hidden */
interface ChatProperties extends BaseProperties {
	id?: string;
	video?: Video;
	author?: BaseChannel;
	message?: string;
	timestamp?: number;
}

/** Represents a chat in a live stream */
export class Chat extends Base implements ChatProperties {
	id?: string;
	/** The video this chat belongs to */
	video!: Video;
	/** The chat's author */
	author!: BaseChannel;
	/** The message of this chat */
	message!: string;
	/** Timestamp in usec / microsecond */
	timestamp!: number;

	/** @hidden */
	constructor(attr: ChatProperties) {
		super(attr.client);
		Object.assign(this, attr);
	}

	/**
	 * Load this instance with raw data from Youtube
	 *
	 * @hidden
	 */
	load(data: YoutubeRawData): Chat {
		ChatParser.loadChat(this, data);
		return this;
	}
}
