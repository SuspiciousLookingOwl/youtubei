import { YoutubeRawData, getContinuationFromItems } from "../../common";
import { Continuable, ContinuableConstructorParams, FetchResult } from "../Continuable";
import { VideoCompact } from "../VideoCompact";
import { I_END_POINT } from "../constants";
import { BaseChannel } from "./BaseChannel";
import { BaseChannelParser } from "./BaseChannelParser";

type ConstructorParams = ContinuableConstructorParams & {
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
export class ChannelShorts extends Continuable<VideoCompact> {
	/** The channel this shorts belongs to */
	channel?: BaseChannel;

	/** @hidden */
	constructor({ client, channel }: ConstructorParams) {
		super({ client, strictContinuationCheck: true });
		this.channel = channel;
	}

	protected async fetch(): Promise<FetchResult<VideoCompact>> {
		const params = BaseChannelParser.TAB_TYPE_PARAMS.shorts;

		const response = await this.client.http.post(`${I_END_POINT}/browse`, {
			data: { browseId: this.channel?.id, params, continuation: this.continuation },
		});

		const items = BaseChannelParser.parseTabData("shorts", response.data);
		const continuation = getContinuationFromItems(items);
		const data = items.filter(
			(i: YoutubeRawData) => "reelItemRenderer" in i || "shortsLockupViewModel" in i
		);

		return {
			continuation,
			items: data.map((i: YoutubeRawData) => {
				const video = new VideoCompact({
					client: this.client,
					channel: this.channel,
				});
				if (i.reelItemRenderer) video.load(i.reelItemRenderer);
				else if (i.shortsLockupViewModel) video.loadLockup(i.lockupViewModel);
				return video;
			}),
		};
	}
}
