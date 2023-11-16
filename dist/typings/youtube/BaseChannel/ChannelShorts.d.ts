import { Continuable, ContinuableConstructorParams, FetchResult } from "../Continuable";
import { VideoCompact } from "../VideoCompact";
import { BaseChannel } from "./BaseChannel";
declare type ConstructorParams = ContinuableConstructorParams & {
    channel?: BaseChannel;
};
/**
 * {@link Continuable} of shorts inside a {@link BaseChannel}
 *
 * @example
 * ```js
 * const channel = await youtube.findOne(CHANNEL_NAME, {type: "channel"});
 * await channel.short.next();
 * console.log(channel.short.items) // first 30 shorts
 *
 * let newShorts = await channel.short.next();
 * console.log(newShorts) // 30 loaded shorts
 * console.log(channel.short.items) // first 60 shorts
 *
 * await channel.short.next(0); // load the rest of the shorts in the channel
 * ```
 */
export declare class ChannelShorts extends Continuable<VideoCompact> {
    /** The channel this shorts belongs to */
    channel?: BaseChannel;
    /** @hidden */
    constructor({ client, channel }: ConstructorParams);
    protected fetch(): Promise<FetchResult<VideoCompact>>;
}
export {};
