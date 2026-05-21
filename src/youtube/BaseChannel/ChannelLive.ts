import { YoutubeRawData, Thumbnails, getContinuationFromItems, getDuration, mapFilter, stripToInt } from "../../common";
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

		const videoRenderers = mapFilter(items, "videoRenderer");
		const lockupViewModels = mapFilter(items, "lockupViewModel");

		const fromVideoRenderer = videoRenderers.map((i: YoutubeRawData) =>
			new VideoCompact({ client: this.client, channel: this.channel }).load(i)
		);

		const fromLockup = lockupViewModels.map((i: YoutubeRawData) => {
			const v = new VideoCompact({ client: this.client, channel: this.channel });
			v.id = i.contentId;
			v.title = i.metadata?.lockupMetadataViewModel?.title?.content;
			v.thumbnails = new Thumbnails().load(i.contentImage?.thumbnailViewModel?.image?.sources || []);

			const overlays = i.contentImage?.thumbnailViewModel?.overlays?.[0] || {};
			const badges = overlays.thumbnailBottomOverlayViewModel?.badges || [];
			const badgeText = badges[0]?.thumbnailBadgeViewModel?.text || "";
			v.isLive = badgeText === "LIVE";
			v.duration = !v.isLive && badgeText ? getDuration(badgeText) : null;

			const metaRows = i.metadata?.lockupMetadataViewModel?.metadata?.contentMetadataViewModel?.metadataRows || [];
			const metaText = metaRows[0]?.metadataParts?.[0]?.text?.content || "";
			v.viewCount = stripToInt(metaText);

			return v;
		});

		return {
			continuation,
			items: [...fromVideoRenderer, ...fromLockup],
		};
	}
}
