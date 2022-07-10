import { BaseVideoParser, Comment, Video } from "..";
import { getContinuationFromItems, mapFilter, YoutubeRawData } from "../../common";

export class VideoParser {
	static loadVideo(target: Video, data: YoutubeRawData): Video {
		const videoInfo = BaseVideoParser.parseRawData(data);
		target.duration = +videoInfo.videoDetails.lengthSeconds;

		const itemSectionRenderer = data[3].response.contents.twoColumnWatchNextResults.results.results.contents
			.reverse()
			.find((c: YoutubeRawData) => c.itemSectionRenderer).itemSectionRenderer;

		target.commentContinuation = getContinuationFromItems(itemSectionRenderer.contents);

		return target;
	}

	static parseComments(data: YoutubeRawData, video: Video): Comment[] {
		const endpoints = data.onResponseReceivedEndpoints.pop();

		const continuationItems = (
			endpoints.reloadContinuationItemsCommand || endpoints.appendContinuationItemsAction
		).continuationItems;

		const comments = mapFilter(continuationItems, "commentThreadRenderer");
		return comments.map((c: YoutubeRawData) =>
			new Comment({ video, client: video.client }).load(c)
		);
	}

	static parseCommentContinuation(data: YoutubeRawData): string | undefined {
		const endpoints = data.onResponseReceivedEndpoints.pop();

		const continuationItems = (
			endpoints.reloadContinuationItemsCommand || endpoints.appendContinuationItemsAction
		).continuationItems;

		return getContinuationFromItems(continuationItems);
	}
}
