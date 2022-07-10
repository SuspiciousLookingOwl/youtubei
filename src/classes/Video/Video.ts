import { YoutubeRawData } from "../../common";
import { I_END_POINT } from "../../constants";
import { BaseVideo, BaseVideoAttributes } from "../BaseVideo";
import { Comment } from "../Comment";
import { VideoParser } from "./VideoParser";

/** @hidden */
interface VideoAttributes extends BaseVideoAttributes {
	duration: number;
	comments: Comment[];
	commentContinuation?: string;
}

/** Represents a Video, usually returned from `client.getVideo()`  */
export class Video extends BaseVideo implements VideoAttributes {
	/** The duration of this video in second */
	duration!: number;
	/**
	 * Comments of this video
	 *
	 * You need to load the comment first by calling `video.nextComments()` as youtube doesn't send any comments data when loading the video (from `client.getVideo()`)
	 */
	comments: Comment[] = [];
	/** Current continuation token to load next comments  */
	commentContinuation?: string;

	/** @hidden */
	constructor(video: Partial<VideoAttributes> = {}) {
		super();
		Object.assign(this, video);
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

	/**
	 * Load next 20 comments of the video, and push the loaded comments to {@link Video.comments}
	 * You can only load up to 2000 comments from a video, this is due to the limitation from Youtube
	 *
	 * @example
	 * ```js
	 * const video = await youtube.getVideo(VIDEO_ID);
	 * await video.nextComments();
	 * console.log(video.comments) // first 20 comments
	 *
	 * let newComments = await video.nextComments();
	 * console.log(newComments) // 20 loaded comments
	 * console.log(video.comments) // first 40 comments
	 *
	 * await video.nextComments(0); // load the rest of the comments in the video
	 * ```
	 *
	 * @param count How many times to load the next comments. Set 0 to load all comments (might take a while on a video with many comments!)
	 *
	 * @returns Loaded comments
	 */
	async nextComments(count = 1): Promise<Comment[]> {
		const newComments: Comment[] = [];

		for (let i = 0; i < count || count == 0; i++) {
			if (!this.commentContinuation) break;

			const response = await this.client.http.post(`${I_END_POINT}/next`, {
				data: { continuation: this.commentContinuation },
			});

			newComments.push(...VideoParser.parseComments(response.data, this));
			this.commentContinuation = VideoParser.parseCommentContinuation(response.data);
		}

		this.comments.push(...newComments);
		return newComments;
	}
}
