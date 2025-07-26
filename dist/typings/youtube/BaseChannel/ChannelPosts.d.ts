import { Continuable, ContinuableConstructorParams, FetchResult } from "../Continuable";
import { Post } from "../Post";
import { BaseChannel } from "./BaseChannel";
declare type ConstructorParams = ContinuableConstructorParams & {
    channel?: BaseChannel;
};
/**
 * {@link Continuable} of posts inside a {@link BaseChannel}
 *
 * @example
 * ```js
 * const channel = await youtube.findOne(CHANNEL_NAME, {type: "channel"});
 * await channel.posts.next();
 * console.log(channel.posts.items) // first 30 posts
 *
 * let newPosts = await channel.posts.next();
 * console.log(newPosts) // 30 loaded posts
 * console.log(channel.posts.items) // first 60 posts
 *
 * await channel.posts.next(0); // load the rest of the posts in the channel
 * ```
 */
export declare class ChannelPosts extends Continuable<Post> {
    /** The channel this posts belongs to */
    channel?: BaseChannel;
    /** @hidden */
    constructor({ client, channel }: ConstructorParams);
    protected fetch(): Promise<FetchResult<Post>>;
}
export {};
