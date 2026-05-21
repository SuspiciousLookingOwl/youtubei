import { getContinuationFromItems, getDuration, mapFilter, stripToInt, Thumbnails, YoutubeRawData } from "../../common";
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
export class ChannelVideos extends Continuable<VideoCompact> {
	/** The channel this videos belongs to */
	channel?: BaseChannel;

	/** @hidden */
	constructor({ client, channel }: ConstructorParams) {
		super({ client, strictContinuationCheck: true });
		this.channel = channel;
	}

	protected async fetch(): Promise<FetchResult<VideoCompact>> {
		const params = BaseChannelParser.TAB_TYPE_PARAMS.videos;

		const response = await this.client.http.post(`${I_END_POINT}/browse`, {
			data: { browseId: this.channel?.id, params, continuation: this.continuation },
		});

		const items = BaseChannelParser.parseTabData("videos", response.data);
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
