import { getDuration, stripToInt, YoutubeRawData } from "../common";
import { Base, Channel, Thumbnails, BaseAttributes, Video, LiveVideo } from ".";

/** @hidden */
interface VideoCompactAttributes extends BaseAttributes {
	title: string;
	thumbnails: Thumbnails;
	duration: number | null;
	isLiveContent: boolean;
	channel?: Channel;
	uploadDate?: string;
	viewCount?: number | null;
}

/** Represent a compact video (e.g. from search result, playlist's videos, channel's videos) */
export default class VideoCompact extends Base implements VideoCompactAttributes {
	/** The title of the video */
	title!: string;
	/** Thumbnails of the video with different sizes */
	thumbnails!: Thumbnails;
	/** The duration of this video in second, null if the video is live */
	duration!: number | null;
	/** Whether this video is a live content or not */
	isLiveContent!: boolean;
	/** The channel who uploads this video */
	channel?: Channel;
	/** The date this video is uploaded at */
	uploadDate?: string;
	/** How many view does this video have, null if the view count is hidden */
	viewCount?: number | null;

	/** @hidden */
	constructor(videoCompact: Partial<VideoCompactAttributes> = {}) {
		super();
		Object.assign(this, videoCompact);
	}

	/** Whether this video is private / deleted or not, only useful in playlist's videos */
	get isPrivateOrDeleted(): boolean {
		return !this.duration;
	}

	/**
	 * Load this instance with raw data from Youtube
	 *
	 * @hidden
	 */
	load(data: YoutubeRawData): VideoCompact {
		const {
			videoId,
			title,
			lengthText,
			thumbnail,
			ownerText,
			shortBylineText,
			publishedTimeText,
			viewCountText,
			badges,
			thumbnailOverlays,
		} = data;

		this.id = videoId;
		this.title = title.simpleText || title.runs[0]?.text;
		this.thumbnails = new Thumbnails().load(thumbnail.thumbnails);
		this.uploadDate = publishedTimeText?.simpleText;

		this.duration =
			getDuration(
				lengthText?.simpleText ||
					thumbnailOverlays[0].thumbnailOverlayTimeStatusRenderer?.text.simpleText ||
					""
			) || null;

		this.isLiveContent = !!(
			badges?.[0].metadataBadgeRenderer.style === "BADGE_STYLE_TYPE_LIVE_NOW"
		);

		// Channel
		if (ownerText || shortBylineText) {
			const { browseId, canonicalBaseUrl } = (
				ownerText || shortBylineText
			).runs[0].navigationEndpoint.browseEndpoint;

			this.channel = new Channel({
				id: browseId,
				name: (ownerText || shortBylineText).runs[0].text,
				url: "https://www.youtube.com" + (canonicalBaseUrl || `/channel/${browseId}`),
				client: this.client,
			});
		}

		this.viewCount = stripToInt(viewCountText?.simpleText || viewCountText?.runs[0].text);

		return this;
	}

	/**
	 * Get {@link Video} object based on current video id
	 *
	 * Equivalent to
	 * ```js
	 * client.getVideo(videoCompact.id);
	 * ```
	 */
	async getVideo(): Promise<Video | LiveVideo> {
		return (await this.client.getVideo(this.id)) as Video | LiveVideo;
	}
}
