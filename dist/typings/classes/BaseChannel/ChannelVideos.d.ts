import { Continuable, ContinuableConstructorParams, FetchResult } from "../Continuable";
import { VideoCompact } from "../VideoCompact";
import { BaseChannel } from "./BaseChannel";
declare type ConstructorParams = ContinuableConstructorParams & {
    channel?: BaseChannel;
};
/**
 * {@link Continuable} of videos inside a {@link BaseChannel}
 *
 * @example
 * ```js
 * const channel = await youtube.findOne(CHANNEL_NAME, {type: "channel"});
 * await channel.videos.next();
 * console.log(channel.videos.items) // first 30 videos
 *
 * let newVideos = await channel.videos.next();
 * console.log(newVideos) // 30 loaded videos
 * console.log(channel.videos.items) // first 60 videos
 *
 * await channel.videos.next(0); // load the rest of the videos in the channel
 * ```
 */
export declare class ChannelVideos extends Continuable<VideoCompact> {
    /** The channel this videos belongs to */
    channel?: BaseChannel;
    /** @hidden */
    constructor({ client, channel }: ConstructorParams);
    protected fetch(): Promise<FetchResult<VideoCompact>>;
}
export {};
