import {
	Base,
	BaseAttributes,
	ChannelCompact,
	PlaylistCompact,
	Thumbnails,
	VideoCompact,
} from "..";
import { getContinuationFromItems, YoutubeRawData } from "../../common";
import { I_END_POINT } from "../../constants";
import { BaseVideoParser } from "./BaseVideoParser";

/** @hidden */
export interface BaseVideoAttributes extends BaseAttributes {
	title: string;
	thumbnails: Thumbnails;
	description: string;
	channel: ChannelCompact;
	uploadDate: string;
	viewCount: number | null;
	likeCount: number | null;
	isLiveContent: boolean;
	tags: string[];
	related: (VideoCompact | PlaylistCompact)[];
	relatedContinuation?: string;
}

/** Represents a Video  */
export class BaseVideo extends Base implements BaseVideoAttributes {
	/** The title of this video */
	title!: string;
	/** Thumbnails of the video with different sizes */
	thumbnails!: Thumbnails;
	/** The description of this video */
	description!: string;
	/** The channel that uploaded this video */
	channel!: ChannelCompact;
	/** The date this video is uploaded at */
	uploadDate!: string;
	/** How many view does this video have, null if the view count is hidden */
	viewCount!: number | null;
	/** How many like does this video have, null if the like count hidden */
	likeCount!: number | null;
	/** Whether this video is a live content or not */
	isLiveContent!: boolean;
	/** The tags of this video */
	tags!: string[];
	/** Videos / playlists related to this video  */
	related: (VideoCompact | PlaylistCompact)[] = [];
	/** Current continuation token to load next related content  */
	relatedContinuation?: string;

	/** @hidden */
	constructor(video: Partial<BaseVideoAttributes> = {}) {
		super();
		Object.assign(this, video);
	}

	/**
	 * Load this instance with raw data from Youtube
	 *
	 * @hidden
	 */
	load(data: YoutubeRawData): BaseVideo {
		BaseVideoParser.loadBaseVideo(this, data);
		return this;
	}

	/**
	 * Video / playlist to play next after this video, alias to
	 * ```js
	 * video.related[0]
	 * ```
	 */
	get upNext(): VideoCompact | PlaylistCompact {
		return this.related[0];
	}

	/** Load next related videos / playlists */
	async nextRelated(count = 1): Promise<(VideoCompact | PlaylistCompact)[]> {
		const newRelated: (VideoCompact | PlaylistCompact)[] = [];
		for (let i = 0; i < count || count == 0; i++) {
			if (this.relatedContinuation === undefined) break;

			const response = await this.client.http.post(`${I_END_POINT}/next`, {
				data: { continuation: this.relatedContinuation },
			});

			newRelated.push(...BaseVideoParser.parseRelated(response.data, this.client));
			this.relatedContinuation = getContinuationFromItems(response.data);
		}

		this.related.push(...newRelated);
		return newRelated;
	}
}
