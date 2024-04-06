import { getContinuationFromItems, Thumbnails, YoutubeRawData } from "../../common";
import { BaseVideoParser } from "../BaseVideo";
import { Comment } from "../Comment";
import { Video } from "./Video";

export class VideoParser {
	static loadVideo(target: Video, data: YoutubeRawData): Video {
		const videoInfo = BaseVideoParser.parseRawData(data);
		target.duration = +videoInfo.videoDetails.lengthSeconds;

		const itemSectionRenderer = data.response.contents.twoColumnWatchNextResults.results.results.contents
			.reverse()
			.find((c: YoutubeRawData) => c.itemSectionRenderer)?.itemSectionRenderer;

		target.comments.continuation = getContinuationFromItems(
			itemSectionRenderer?.contents || []
		);

		const chapters =
			data.response.playerOverlays.playerOverlayRenderer.decoratedPlayerBarRenderer
				?.decoratedPlayerBarRenderer.playerBar.multiMarkersPlayerBarRenderer.markersMap?.[0]
				.value.chapters;

		target.chapters =
			chapters?.map(({ chapterRenderer: c }: YoutubeRawData) => ({
				title: c.title.simpleText,
				start: c.timeRangeStartMillis,
				thumbnails: new Thumbnails().load(c.thumbnail.thumbnails),
			})) || [];

		return target;
	}

	static parseComments(data: YoutubeRawData, video: Video): Comment[] {
		const comments = data.frameworkUpdates.entityBatchUpdate.mutations
			.filter((m: YoutubeRawData) => m.payload.commentEntityPayload)
			.map((m: YoutubeRawData) => m.payload.commentEntityPayload);

		return comments.map((c: YoutubeRawData) =>
			new Comment({ video, client: video.client }).load(c)
		);
	}

	static parseCommentContinuation(data: YoutubeRawData): string | undefined {
		const endpoints = data.onResponseReceivedEndpoints.at(-1);

		const continuationItems = (
			endpoints.reloadContinuationItemsCommand || endpoints.appendContinuationItemsAction
		).continuationItems;

		return getContinuationFromItems(continuationItems);
	}
}
