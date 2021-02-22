import { getDuration, YoutubeRawData } from "../common";
import { Base, Channel, Thumbnails } from ".";

/** @hidden */
interface VideoCompactAttributes {
	id: string;
	title: string;
	thumbnails: Thumbnails;
	duration: number | null;
	isLiveContent: boolean;
	channel?: Channel;
	uploadDate?: string;
	viewCount?: number;
}

/** Represent a compact video (e.g. from search result, playlist's videos, channel's videos) */
export default class VideoCompact extends Base implements VideoCompactAttributes {
	/** The video's ID */
	id!: string;
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
	viewCount?: number;

	/** @hidden */
	constructor(videoCompact: Partial<VideoCompactAttributes> = {}) {
		super();
		Object.assign(this, videoCompact);
	}

	/**
	 * Load instance attributes from youtube raw data
	 *
	 * @param youtubeRawData raw object from youtubei
	 * @hidden
	 */
	load(youtubeRawData: YoutubeRawData): VideoCompact {
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
		} = youtubeRawData;

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

		this.isLiveContent = badges
			? badges[0].metadataBadgeRenderer.style === "BADGE_STYLE_TYPE_LIVE_NOW"
			: false;

		// Channel
		if (ownerText || shortBylineText) {
			const { browseId, canonicalBaseUrl } = (
				ownerText || shortBylineText
			).runs[0].navigationEndpoint.browseEndpoint;

			this.channel = new Channel({
				id: browseId,
				name: (ownerText || shortBylineText).runs[0].text,
				url: "https://www.youtube.com" + (canonicalBaseUrl || `/channel/${browseId}`),
			});
		}

		if (!this.isLiveContent)
			this.viewCount = +viewCountText?.simpleText?.replace(/[^0-9]/g, "") || undefined;
		else this.viewCount = +viewCountText?.runs[0].text.replace(/[^0-9]/g, "") || undefined;

		return this;
	}

	/**
	 * Whether this video is private / deleted or not, only useful in playlist's videos
	 */
	get isPrivateOrDeleted(): boolean {
		return !this.duration;
	}
}
