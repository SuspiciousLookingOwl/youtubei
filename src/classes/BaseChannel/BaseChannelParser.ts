import { stripToInt, YoutubeRawData } from "../../common";
import { Thumbnails } from "../Thumbnails";
import { BaseChannel } from "./BaseChannel";

export class BaseChannelParser {
	static loadBaseChannel(target: BaseChannel, data: YoutubeRawData): BaseChannel {
		const { channelId, title, thumbnail, videoCountText, subscriberCountText } = data;

		target.id = channelId;
		target.name = title.simpleText;
		target.thumbnails = new Thumbnails().load(thumbnail.thumbnails);
		target.videoCount = stripToInt(videoCountText?.runs[0].text) || 0;
		target.subscriberCount = subscriberCountText?.simpleText;

		return target;
	}

	/** Parse tab data from request, tab name is ignored if it's a continuation data */
	static parseTabData(name: "videos" | "playlists", data: YoutubeRawData): YoutubeRawData {
		const index = name === "videos" ? 1 : 2;
		return (
			data.contents?.twoColumnBrowseResultsRenderer.tabs[index].tabRenderer.content
				.sectionListRenderer.contents[0].itemSectionRenderer.contents[0].gridRenderer
				?.items ||
			data.onResponseReceivedActions?.[0].appendContinuationItemsAction.continuationItems ||
			[]
		);
	}
}
