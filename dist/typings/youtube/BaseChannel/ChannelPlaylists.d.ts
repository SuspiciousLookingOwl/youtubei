import { Continuable, ContinuableConstructorParams, FetchResult } from "../Continuable";
import { PlaylistCompact } from "../PlaylistCompact";
import { BaseChannel } from "./BaseChannel";
declare type ConstructorParams = ContinuableConstructorParams & {
    channel?: BaseChannel;
};
/**
 * {@link Continuable} of playlists inside a {@link BaseChannel}
 *
 * @example
 * ```js
 * const channel = await youtube.findOne(CHANNEL_NAME, {type: "channel"});
 * await channel.playlists.next();
 * console.log(channel.playlists.items) // first 30 playlists
 *
 * let newPlaylists = await channel.playlists.next();
 * console.log(newPlaylists) // 30 loaded playlists
 * console.log(channel.playlists.items) // first 60 playlists
 *
 * await channel.playlists.next(0); // load the rest of the playlists in the channel
 * ```
 */
export declare class ChannelPlaylists extends Continuable<PlaylistCompact> {
    /** The channel this playlists belongs to */
    channel?: BaseChannel;
    /** @hidden */
    constructor({ client, channel }: ConstructorParams);
    protected fetch(): Promise<FetchResult<PlaylistCompact>>;
}
export {};
