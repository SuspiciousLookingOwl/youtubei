import { PlaylistCompact, VideoCompact, Channel, Base } from ".";
import { Thumbnail, YoutubeRawData } from "../common";

interface VideoAttributes {
	id: string;
	title: string;
	duration: number | null;
	thumbnails: Thumbnail[];
	description: string;
	channel: Channel;
	uploadDate: string;
	viewCount: number | null;
	likeCount: number | null;
	dislikeCount: number | null;
	isLiveContent: boolean;
	tags: string[];
	upNext: VideoCompact | PlaylistCompact;
	related: (VideoCompact | PlaylistCompact)[];
}

/**
 * Represent a Video
 */
export default class Video extends Base implements VideoAttributes {
	id!: string;
	title!: string;
	duration!: number | null;
	description!: string;
	channel!: Channel;
	uploadDate!: string;
	viewCount!: number | null;
	likeCount!: number | null;
	dislikeCount!: number | null;
	isLiveContent!: boolean;
	tags!: string[];
	upNext!: VideoCompact | PlaylistCompact;
	related!: (VideoCompact | PlaylistCompact)[];

	constructor(video: Partial<VideoAttributes> = {}) {
		super();
		Object.assign(this, video);
	}

	/**
	 * Load instance attributes from youtube raw data
	 *
	 * @param youtubeRawData raw object from youtubei
	 */
	load(youtubeRawData: YoutubeRawData): Video {
		const contents =
			youtubeRawData[3].response.contents.twoColumnWatchNextResults.results.results.contents;

		const primaryInfo = contents.find((c: YoutubeRawData) => "videoPrimaryInfoRenderer" in c)
			.videoPrimaryInfoRenderer;
		const secondaryInfo = contents.find(
			(c: YoutubeRawData) => "videoSecondaryInfoRenderer" in c
		).videoSecondaryInfoRenderer;
		const videoDetails = youtubeRawData[2].playerResponse.videoDetails;
		const videoInfo = { ...secondaryInfo, ...primaryInfo, videoDetails };

		// Basic information
		this.id = videoInfo.videoDetails.videoId;
		this.title = videoInfo.videoDetails.title;
		this.duration = +videoInfo.videoDetails.lengthSeconds || null;
		this.uploadDate = videoInfo.dateText.simpleText;
		this.viewCount = +videoInfo.videoDetails.viewCount;
		this.isLiveContent = videoInfo.videoDetails.isLiveContent;
		this.thumbnails = videoInfo.videoDetails.thumbnail.thumbnails;

		// Channel
		const { title, thumbnail } = videoInfo.owner.videoOwnerRenderer;
		this.channel = new Channel({
			id: title.runs[0].navigationEndpoint.browseEndpoint.browseId,
			name: title.runs[0].text,
			thumbnails: thumbnail.thumbnails,
			url: `https://www.youtube.com/channel/${title.runs[0].navigationEndpoint.browseEndpoint.browseId}`,
		});

		// Like Count and Dislike Count
		const topLevelButtons = videoInfo.videoActions.menuRenderer.topLevelButtons;
		this.likeCount =
			+topLevelButtons[0].toggleButtonRenderer.defaultText.accessibility?.accessibilityData.label.replace(
				/[^0-9]/g,
				""
			) || null;
		this.dislikeCount =
			+topLevelButtons[1].toggleButtonRenderer.defaultText.accessibility?.accessibilityData.label.replace(
				/[^0-9]/g,
				""
			) || null;

		// Tags and description
		this.tags =
			videoInfo.superTitleLink?.runs?.reduce((tags: string[], t: Record<string, string>) => {
				if (t.text.trim()) tags.push(t.text.trim());
				return tags;
			}, []) || [];
		this.description =
			videoInfo.description?.runs.map((d: Record<string, string>) => d.text).join("") || "";

		// Up Next and related videos
		this.related = [];
		const secondaryContents =
			youtubeRawData[3].response.contents.twoColumnWatchNextResults.secondaryResults
				.secondaryResults.results;
		for (const secondaryContent of secondaryContents) {
			if ("compactAutoplayRenderer" in secondaryContent) {
				const content = secondaryContent.compactAutoplayRenderer.contents[0];
				if ("compactVideoRenderer" in content) {
					this.upNext = new VideoCompact().load(content.compactVideoRenderer);
				} else if ("compactRadioRenderer" in content) {
					this.upNext = new PlaylistCompact().load(content.compactRadioRenderer);
				}
			} else if ("compactVideoRenderer" in secondaryContent) {
				this.related.push(new VideoCompact().load(secondaryContent.compactVideoRenderer));
			} else if ("compactRadioRenderer" in secondaryContent) {
				this.related.push(
					new PlaylistCompact().load(secondaryContent.compactRadioRenderer)
				);
			}
		}

		return this;
	}
}
