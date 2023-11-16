import { YoutubeRawData, getContinuationFromItems, mapFilter } from "../../common";
import { Continuable, ContinuableConstructorParams, FetchResult } from "../Continuable";
import { VideoCompact } from "../VideoCompact";
import { I_END_POINT } from "../constants";
import { BaseChannel } from "./BaseChannel";
import { BaseChannelParser } from "./BaseChannelParser";

type ConstructorParams = ContinuableConstructorParams & {
	channel?: BaseChannel;
};

/**
 * {@link Continuable} of videos inside a {@link BaseChannel}
 *
 * @example
 * ```js
 * const channel = await youtube.findOne(CHANNEL_NAME, {type: "channel"});
 * await channel.live.next();
 * console.log(channel.live.items) // first 30 live videos
 *
 * let newLives = await channel.videos.next();
 * console.log(newLives) // 30 loaded live videos
 * console.log(channel.live.items) // first 60 live videos
 *
 * await channel.live.next(0); // load the rest of the live videos in the channel
 * ```
 */
export class ChannelLive extends Continuable<VideoCompact> {
	/** The channel this live videos belongs to */
	channel?: BaseChannel;

	/** @hidden */
	constructor({ client, channel }: ConstructorParams) {
		super({ client, strictContinuationCheck: true });
		this.channel = channel;
	}

	protected async fetch(): Promise<FetchResult<VideoCompact>> {
		const params = BaseChannelParser.TAB_TYPE_PARAMS.live;

		const response = await this.client.http.post(`${I_END_POINT}/browse`, {
			data: { browseId: this.channel?.id, params, continuation: this.continuation },
		});

		const items = BaseChannelParser.parseTabData("live", response.data);
		const continuation = getContinuationFromItems(items);
		const data = mapFilter(items, "videoRenderer");

		return {
			continuation,
			items: data.map((i: YoutubeRawData) =>
				new VideoCompact({ client: this.client, channel: this.channel }).load(i)
			),
		};
	}
}
