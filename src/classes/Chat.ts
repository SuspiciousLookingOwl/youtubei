import { Base, Channel, Video } from ".";
import { YoutubeRawData } from "../common";

/** @hidden */
interface ChatAttributes {
	id: string;
	video: Video;
	author: Channel;
	message: string;
	timestamp: number;
}

/**
 * Represents a Comment / Reply
 */
export default class Chat extends Base implements ChatAttributes {
	/** The comment's ID */
	id!: string;
	/** The video this chat belongs to */
	video!: Video;
	/** The comment's author */
	author!: Channel;
	/** The message of this chat */
	message!: string;
	/** Timestamp in usec / microsecond */
	timestamp!: number;

	/** @hidden */
	constructor(chat: Partial<ChatAttributes> = {}) {
		super();
		Object.assign(this, chat);
	}

	/**
	 * Load instance attributes from youtube raw data
	 *
	 * @param youtubeRawData raw object from youtubei
	 * @hidden
	 */
	load(data: YoutubeRawData): Chat {
		const {
			id,
			message,
			authorName,
			authorPhoto,
			timestampUsec,
			authorExternalChannelId,
		} = data;

		// Basic information
		this.id = id;
		this.message = message.runs.map((r: YoutubeRawData) => r.text).join("");
		this.author = new Channel({
			id: authorExternalChannelId,
			name: authorName.simpleText,
			thumbnails: authorPhoto.thumbnails,
			url: `https://www.youtube.com/channel/${authorExternalChannelId}`,
		});
		this.timestamp = timestampUsec;
		return this;
	}
}
