import { getDuration, YoutubeRawData } from "../common";
import Channel from "./Channel";

interface VideoCompactAttributes {
	id: string;
	title: string;
	duration: number | null;
	thumbnail: string;
	isLiveContent: boolean;
	channel?: Channel;
	uploadDate?: string;
	viewCount?: number;
}

/**
 * Represent a compact video (e.g. from search result, playlist's videos, channel's videos)
 */
export default class VideoCompact implements VideoCompactAttributes {
	id!: string;
	title!: string;
	duration!: number | null;
	thumbnail!: string;
	isLiveContent!: boolean;
	channel?: Channel;
	uploadDate?: string;
	viewCount?: number;
	constructor(videoCompact: Partial<VideoCompactAttributes> = {}) {
		Object.assign(this, videoCompact);
	}

	/**
	 * Load instance attributes from youtube raw data
	 *
	 * @param youtubeRawData raw object from youtubei
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
		this.thumbnail = thumbnail.thumbnails[thumbnail.thumbnails.length - 1].url;
		this.uploadDate = publishedTimeText ? publishedTimeText.simpleText : undefined;

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

			this.channel = ({
				id: browseId,
				name: (ownerText || shortBylineText).runs[0].text,
				url: `https://www.youtube.com${canonicalBaseUrl}`,
			} as unknown) as Channel;
		}

		if (!this.isLiveContent)
			this.viewCount = +viewCountText?.simpleText?.replace(/[^0-9]/g, "") || undefined;
		else this.viewCount = +viewCountText?.runs[0].text.replace(/[^0-9]/g, "") || undefined;

		return this;
	}

	get isPrivateOrDeleted(): boolean {
		return !this.duration;
	}
}
