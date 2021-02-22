import { PlaylistCompact, VideoCompact, Channel, Base, Comment, Thumbnails } from ".";
import { http, YoutubeRawData } from "../common";
import { COMMENT_END_POINT } from "../constants";

/**
 * @hidden
 * @ignore
 * @internal
 */
interface VideoAttributes {
	id: string;
	title: string;
	duration: number | null;
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
	comments: Comment[];
}

/** Represents a Video, usually returned from `client.getVideo()`  */
export default class Video extends Base implements VideoAttributes {
	/** The video's ID */
	id!: string;
	/** The title of this video */
	title!: string;
	/** The duration of this video in second, null if the video is live */
	duration!: number | null;
	/** Thumbnails of the video with different sizes */
	thumbnails!: Thumbnails;
	/** The description of this video */
	description!: string;
	/** The channel who uploads this video */
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
	/**
	 * Comments of this video
	 *
	 * You need to load the comment first by calling `video.nextComments()` as youtube doesn't send any comments data when loading the video (from `client.getVideo()`)
	 */
	comments!: Comment[];

	private _commentContinuation?: {
		token?: string;
		itct?: string;
		xsrfToken?: string;
	};

	/** @hidden */
	constructor(video: Partial<VideoAttributes> = {}) {
		super();
		Object.assign(this, video);
	}

	/**
	 * Load instance attributes from youtube raw data
	 *
	 * @param youtubeRawData raw object from youtubei
	 * @hidden
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
	 * Load next 20 comments of the video
	 *
	 * @example
	 * ```js
	 * const video = await youtube.getVideo(VIDEO_ID);
	 * console.log(video.comments) // first 20 comments
	 *
	 * let newComments = await video.nextComments();
	 * console.log(newComments) // 20 loaded comments
	 * console.log(video.comments) // first 40 comments
	 *
	 * await video.nextComments(0); // load the rest of the comments in the playlist
	 * ```
	 *
	 * @param count How many times to load the next comments. Set 0 to load all comments (might take a while on a video with many comments!)
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

			const continuation = continuations?.pop().nextContinuationData;
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
