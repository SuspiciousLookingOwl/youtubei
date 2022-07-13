import { getContinuationFromItems, mapFilter, YoutubeRawData } from "../../common";
import { I_END_POINT } from "../../constants";
import { Continuable, ContinuableConstructorParams, FetchReturnType } from "../Continuable";
import { PlaylistCompact } from "../PlaylistCompact";
import { BaseChannel } from "./BaseChannel";
import { BaseChannelParser } from "./BaseChannelParser";

type ConstructorParams = ContinuableConstructorParams & {
	channel?: BaseChannel;
};

/**
 * {@link Continuable} of playlists inside a Channel
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
 * await channel.nextPlaylists(0); // load the rest of the playlists in the channel
 * ```
 */
export class ChannelPlaylists extends Continuable<PlaylistCompact> {
	/** The channel this playlists belongs to */
	channel?: BaseChannel;

	constructor({ client, channel }: ConstructorParams) {
		super({ client, strictContinuationCheck: true });
		this.channel = channel;
	}

	protected async fetch(): FetchReturnType<PlaylistCompact> {
		const params = "EglwbGF5bGlzdHMgAQ%3D%3D";

		const response = await this.client.http.post(`${I_END_POINT}/browse`, {
			data: { browseId: this.channel?.id, params, continuation: this.continuation },
		});

		const items = BaseChannelParser.parseTabData("playlists", response.data);
		const continuation = getContinuationFromItems(items);
		const data = mapFilter(items, "gridPlaylistRenderer");

		return {
			continuation,
			items: data.map((i: YoutubeRawData) =>
				new PlaylistCompact({ client: this.client }).load(i)
			),
		};
	}
}
