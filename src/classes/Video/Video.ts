import { YoutubeRawData } from "../../common";
import { BaseVideo, BaseVideoProperties } from "../BaseVideo";
import { VideoComments } from "./VideoComments";
import { VideoParser } from "./VideoParser";

/** @hidden */
interface VideoProperties extends BaseVideoProperties {
	duration?: number;
	comments?: VideoComments;
}

/** Represents a Video, usually returned from `client.getVideo()`  */
export class Video extends BaseVideo implements VideoProperties {
	/** The duration of this video in second */
	duration!: number;
	/** {@link Continuable} of videos inside a {@link Video} */
	comments: VideoComments;

	/** @hidden */
	constructor(attr: VideoProperties) {
		super(attr);
		Object.assign(this, attr);

		this.comments = new VideoComments({ client: attr.client, video: this });
	}

	/**
	 * Load this instance with raw data from Youtube
	 *
	 * @hidden
	 */
	load(data: YoutubeRawData): Video {
		super.load(data);
		VideoParser.loadVideo(this, data);
		return this;
	}
}
