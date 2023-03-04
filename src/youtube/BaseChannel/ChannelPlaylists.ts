import { getContinuationFromItems, mapFilter, YoutubeRawData } from "../../common";
import { Continuable, ContinuableConstructorParams, FetchResult } from "../Continuable";
import { PlaylistCompact } from "../PlaylistCompact";
import { I_END_POINT } from "../constants";
import { BaseChannel } from "./BaseChannel";
import { BaseChannelParser } from "./BaseChannelParser";

type ConstructorParams = ContinuableConstructorParams & {
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
export class ChannelPlaylists extends Continuable<PlaylistCompact> {
	/** The channel this playlists belongs to */
	channel?: BaseChannel;

	/** @hidden */
	constructor({ client, channel }: ConstructorParams) {
		super({ client, strictContinuationCheck: true });
		this.channel = channel;
	}

	protected async fetch(): Promise<FetchResult<PlaylistCompact>> {
		const params = BaseChannelParser.TAB_TYPE_PARAMS.playlists;

		const response = await this.client.http.post(`${I_END_POINT}/browse`, {
			data: { browseId: this.channel?.id, params, continuation: this.continuation },
		});

		const items = BaseChannelParser.parseTabData("playlists", response.data);
		const continuation = getContinuationFromItems(items);
		const data = mapFilter(items, "gridPlaylistRenderer");

		return {
			continuation,
			items: data.map((i: YoutubeRawData) =>
				new PlaylistCompact({ client: this.client, channel: this.channel }).load(i)
			),
		};
	}
}
