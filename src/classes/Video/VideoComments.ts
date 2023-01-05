import { Comment } from "../Comment";
import { Continuable, ContinuableConstructorParams, FetchResult } from "../Continuable";
import { I_END_POINT } from "../constants";
import { Video } from "./Video";
import { VideoParser } from "./VideoParser";

type ConstructorParams = ContinuableConstructorParams & {
	video: Video;
};

/**
 * {@link Continuable} of videos inside a {@link Video}
 *
 * @example
 * ```js
 * const video = await youtube.getVideo(VIDEO_ID);
 * await video.comments.next();
 * console.log(video.comments) // first 20 comments
 *
 * let newComments = await video.comments.next();
 * console.log(newComments) // 20 loaded comments
 * console.log(video.comments) // first 40 comments
 *
 * await video.comments.next(0); // load the rest of the comments in the video
 * ```
 *
 * @param count How many times to load the next comments. Set 0 to load all comments (might take a while on a video with many  comments!)
 *
 * @returns Loaded comments
 */
export class VideoComments extends Continuable<Comment> {
	/** The playlist this videos belongs to */
	video: Video;

	/** @hidden */
	constructor({ client, video }: ConstructorParams) {
		super({ client, strictContinuationCheck: true });
		this.video = video;
	}

	protected async fetch(): Promise<FetchResult<Comment>> {
		const response = await this.client.http.post(`${I_END_POINT}/next`, {
			data: { continuation: this.continuation },
		});

		const items = VideoParser.parseComments(response.data, this.video);
		const continuation = VideoParser.parseCommentContinuation(response.data);

		return { continuation, items };
	}
}
