import { Comment } from "../Comment";
import { Continuable, ContinuableConstructorParams, FetchResult } from "../Continuable";
import { Video } from "./Video";
declare type ConstructorParams = ContinuableConstructorParams & {
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
export declare class VideoComments extends Continuable<Comment> {
    /** The playlist this videos belongs to */
    video: Video;
    /** @hidden */
    constructor({ client, video }: ConstructorParams);
    protected fetch(): Promise<FetchResult<Comment>>;
}
export {};
