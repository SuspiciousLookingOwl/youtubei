import { stripToInt, YoutubeRawData } from "../../common";
import { Thumbnails } from "../Thumbnails";
import { BaseChannel } from "./BaseChannel";

export class BaseChannelParser {
	static TAB_TYPE_PARAMS = {
		videos: "EgZ2aWRlb3M%3D",
		playlists: "EglwbGF5bGlzdHM%3D",
	} as const;

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
		const tab = data.contents?.twoColumnBrowseResultsRenderer.tabs.find((t: YoutubeRawData) => {
			return (
				t.tabRenderer?.endpoint.browseEndpoint.params ===
				BaseChannelParser.TAB_TYPE_PARAMS[name]
			);
		});

		return (
			tab?.tabRenderer.content.sectionListRenderer.contents[0].itemSectionRenderer.contents[0]
				.gridRenderer?.items ||
			data.onResponseReceivedActions?.[0].appendContinuationItemsAction.continuationItems ||
			[]
		);
	}
}
