import { Thumbnails, YoutubeRawData } from "../../common";
import { Base, BaseProperties } from "../Base";
import { BaseChannel } from "../BaseChannel";
import { Caption } from "../Caption";
import { LiveVideo } from "../LiveVideo";
import { Video } from "../Video";
import { VideoCompactParser } from "./VideoCompactParser";

/** @hidden */
interface VideoCompactProperties extends BaseProperties {
	id?: string;
	title?: string;
	thumbnails?: Thumbnails;
	duration?: number | null;
	isLive?: boolean;
	channel?: BaseChannel;
	uploadDate?: string;
	viewCount?: number | null;
}

/** Represent a compact video (e.g. from search result, playlist's videos, channel's videos) */
export class VideoCompact extends Base implements VideoCompactProperties {
	id!: string;
	/** The title of the video */
	title!: string;
	/** Thumbnails of the video with different sizes */
	thumbnails!: Thumbnails;
	/** Description of the video (not a full description, rather a preview / snippet) */
	description!: string;
	/** The duration of this video in second, null if the video is live */
	duration!: number | null;
	/** Whether this video is a live now or not */
	isLive!: boolean;
	/** The channel who uploads this video */
	channel?: BaseChannel;
	/** The date this video is uploaded at */
	uploadDate?: string;
	/** How many view does this video have, null if the view count is hidden */
	viewCount?: number | null;

	/** @hidden */
	constructor(attr: VideoCompactProperties) {
		super(attr.client);
		Object.assign(this, attr);
	}

	/** Whether this video is private / deleted or not, only useful in playlist's videos */
	get isPrivateOrDeleted(): boolean {
		return !this.duration;
	}

	/**
	 * Load this instance with raw data from Youtube
	 *
	 * @hidden
	 */
	load(data: YoutubeRawData): VideoCompact {
		VideoCompactParser.loadVideoCompact(this, data);
		return this;
	}

	/**
	 * Get {@link Video} object based on current video id
	 *
	 * Equivalent to
	 * ```js
	 * client.getVideo(videoCompact.id);
	 * ```
	 */
	async getVideo<T extends Video | LiveVideo>(): Promise<T> {
		return await this.client.getVideo(this.id);
	}

	/**
	 * Get Video transcript (if exists)
	 *
	 * Equivalent to
	 * ```js
	 * client.getVideoTranscript(video.id);
	 * ```
	 */
	async getTranscript(languageCode?: string): Promise<Caption[] | undefined> {
		return this.client.getVideoTranscript(this.id, languageCode);
	}
}
