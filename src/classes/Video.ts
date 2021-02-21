import { PlaylistCompact, VideoCompact, Channel, Base, Comment } from ".";
import { http, Thumbnail, YoutubeRawData } from "../common";
import { COMMENT_END_POINT } from "../constants";

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
	comments: Comment[];
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
	comments!: Comment[];

	private _commentContinuation?: {
		token?: string;
		itct?: string;
		xsrfToken?: string;
	};

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

		// Comment Continuation Token
		this.comments = [];
		const continuation = contents.find((c: YoutubeRawData) => "itemSectionRenderer" in c)
			?.itemSectionRenderer.continuations[0].nextContinuationData;
		if (continuation) {
			this._commentContinuation = {
				token: continuation.continuation,
				itct: continuation.clickTrackingParams,
				xsrfToken: youtubeRawData[3].xsrf_token,
			};
		}

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

	/**
	 * Load next comments of the video
	 *
	 * @param count How many times to load the next comments.
	 */
	async nextComments(count = 1): Promise<Comment[]> {
		const newComments: Comment[] = [];

		for (let i = 0; i < count || count == 0; i++) {
			if (!this._commentContinuation) break;

			// Send request
			const response = await http.post(COMMENT_END_POINT, {
				data: { session_token: this._commentContinuation.xsrfToken },
				headers: { "content-type": "application/x-www-form-urlencoded" },
				params: {
					action_get_comments: "1",
					pbj: "1",
					ctoken: this._commentContinuation.token,
					continuation: this._commentContinuation.token,
					itct: this._commentContinuation.itct,
				},
			});

			const {
				contents: comments,
				continuations,
			} = response.data.response.continuationContents.itemSectionContinuation;

			const continuation = continuations?.pop().nextContinuationData || undefined;
			this._commentContinuation = continuation
				? {
						token: continuation.continuation,
						itct: continuation.clickTrackingParams,
						xsrfToken: response.data.xsrf_token,
				  }
				: undefined;

			for (const comment of comments.map((c: YoutubeRawData) => c.commentThreadRenderer)) {
				newComments.push(new Comment({ video: this }).load(comment));
			}
		}
		this.comments.push(...newComments);
		return newComments;
	}
}
