import { YoutubeRawData } from "../../common";
import { BaseVideoParser } from "../BaseVideo";
import { LiveVideo } from "./LiveVideo";

export class LiveVideoParser {
	static loadLiveVideo(target: LiveVideo, data: YoutubeRawData): LiveVideo {
		const videoInfo = BaseVideoParser.parseRawData(data);

		target.watchingCount = +videoInfo.viewCount.videoViewCountRenderer.viewCount.runs
			.map((r: YoutubeRawData) => r.text)
			.join(" ")
			.replace(/[^0-9]/g, "");

		target.chatContinuation =
			data.response.contents.twoColumnWatchNextResults.conversationBar.liveChatRenderer?.continuations[0].reloadContinuationData.continuation;

		return target;
	}

	static parseChats(data: YoutubeRawData): YoutubeRawData[] {
		return (
			data.continuationContents.liveChatContinuation.actions?.flatMap(
				(a: YoutubeRawData) => a.addChatItemAction?.item.liveChatTextMessageRenderer || []
			) || []
		);
	}

	static parseContinuation(data: YoutubeRawData): { continuation: string; timeout: number } {
		const continuation = data.continuationContents.liveChatContinuation.continuations[0];
		const continuationData =
			continuation.timedContinuationData || continuation.invalidationContinuationData;

		return {
			timeout: continuationData.timeoutMs,
			continuation: continuationData.continuation,
		};
	}
}
