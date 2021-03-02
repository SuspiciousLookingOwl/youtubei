import { BaseVideo, BaseVideoAttributes, Comment } from ".";
import { YoutubeRawData } from "../common";
import { COMMENT_END_POINT } from "../constants";

/** @hidden */
interface VideoAttributes extends BaseVideoAttributes {
	duration: number;
	comments: Comment[];
}

/** Represents a Video, usually returned from `client.getVideo()`  */
export default class Video extends BaseVideo implements VideoAttributes {
	/** The duration of this video in second */
	duration!: number;
	/**
	 * Comments of this video
	 *
	 * You need to load the comment first by calling `video.nextComments()` as youtube doesn't send any comments data when loading the video (from `client.getVideo()`)
	 */
	comments!: Comment[];

	/** @hidden */
	_commentContinuation?: {
		token?: string;
		itct?: string;
		xsrfToken?: string;
	};

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

		const contents =
			data[3].response.contents.twoColumnWatchNextResults.results.results.contents;
		const videoInfo = BaseVideo.parseRawData(data);

		// Comment Continuation Token
		this.comments = [];
		const continuation =
			contents[contents.length - 1]?.itemSectionRenderer.continuations[0]
				.nextContinuationData;
		if (continuation) {
			this._commentContinuation = {
				token: continuation.continuation,
				itct: continuation.clickTrackingParams,
				xsrfToken: data[3].xsrf_token,
			};
		}

		// Duration
		this.duration = +videoInfo.videoDetails.lengthSeconds;

		return this;
	}

	/**
	 * Load next 20 comments of the video, and push the loaded comments to {@link Video.comments}
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
			if (!this._commentContinuation) break;

			// Send request
			const response = await this.client.http.post(COMMENT_END_POINT, {
				data: { session_token: this._commentContinuation.xsrfToken },
				headers: { "content-type": "application/x-www-form-urlencoded" },
				params: {
					action_get_comments: "1",
					pbj: "1",
					ctoken: this._commentContinuation.token,
					continuation: this._commentContinuation.token,
					itct: this._commentContinuation.itct,
				},
			});

			const {
				contents: comments,
				continuations,
			} = response.data.response.continuationContents.itemSectionContinuation;

			const continuation = continuations?.pop().nextContinuationData;
			this._commentContinuation = continuation
				? {
						token: continuation.continuation,
						itct: continuation.clickTrackingParams,
						xsrfToken: response.data.xsrf_token,
				  }
				: undefined;

			for (const comment of comments.map((c: YoutubeRawData) => c.commentThreadRenderer)) {
				newComments.push(new Comment({ video: this, client: this.client }).load(comment));
			}
		}
		this.comments.push(...newComments);
		return newComments;
	}
}
