import { PlaylistCompact, VideoCompact, Channel, Base, BaseAttributes, Thumbnails } from ".";
import { YoutubeRawData } from "../common";

/** @hidden */
export interface BaseVideoAttributes extends BaseAttributes {
	title: string;
	thumbnails: Thumbnails;
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

/** Represents a Video  */
export default class BaseVideo extends Base implements BaseVideoAttributes {
	/** The title of this video */
	title!: string;
	/** Thumbnails of the video with different sizes */
	thumbnails!: Thumbnails;
	/** The description of this video */
	description!: string;
	/** The channel that uploaded this video */
	channel!: Channel;
	/** The date this video is uploaded at */
	uploadDate!: string;
	/** How many view does this video have, null if the view count is hidden */
	viewCount!: number | null;
	/** How many like does this video have, null if the like count hidden */
	likeCount!: number | null;
	/** How many dislike does this video have, null if the dislike count is hidden */
	dislikeCount!: number | null;
	/** Whether this video is a live content or not */
	isLiveContent!: boolean;
	/** The tags of this video */
	tags!: string[];
	/** Next video / playlist recommended by Youtube */
	upNext!: VideoCompact | PlaylistCompact;
	/** Videos / playlists related to this video  */
	related!: (VideoCompact | PlaylistCompact)[];

	/** @hidden */
	constructor(video: Partial<BaseVideoAttributes> = {}) {
		super();
		Object.assign(this, video);
	}

	/**
	 * Load this instance with raw data from Youtube
	 *
	 * @hidden
	 */
	load(data: YoutubeRawData): BaseVideo {
		const videoInfo = BaseVideo.parseRawData(data);

		// Basic information
		this.id = videoInfo.videoDetails.videoId;
		this.title = videoInfo.videoDetails.title;
		this.uploadDate = videoInfo.dateText.simpleText;
		this.viewCount = +videoInfo.videoDetails.viewCount || null;
		this.isLiveContent = videoInfo.videoDetails.isLiveContent;
		this.thumbnails = new Thumbnails().load(videoInfo.videoDetails.thumbnail.thumbnails);

		// Channel
		const { title, thumbnail } = videoInfo.owner.videoOwnerRenderer;
		this.channel = new Channel({
			id: title.runs[0].navigationEndpoint.browseEndpoint.browseId,
			name: title.runs[0].text,
			thumbnails: new Thumbnails().load(thumbnail.thumbnails),
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
			data[3].response.contents.twoColumnWatchNextResults.secondaryResults.secondaryResults
				.results;
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

	/** @hidden */
	static parseRawData(data: YoutubeRawData): YoutubeRawData {
		const contents =
			data[3].response.contents.twoColumnWatchNextResults.results.results.contents;

		const primaryInfo = contents.find((c: YoutubeRawData) => "videoPrimaryInfoRenderer" in c)
			.videoPrimaryInfoRenderer;
		const secondaryInfo = contents.find(
			(c: YoutubeRawData) => "videoSecondaryInfoRenderer" in c
		).videoSecondaryInfoRenderer;
		const videoDetails = data[2].playerResponse.videoDetails;
		return { ...secondaryInfo, ...primaryInfo, videoDetails };
	}
}
