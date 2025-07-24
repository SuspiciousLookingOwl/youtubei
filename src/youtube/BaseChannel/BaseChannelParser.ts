import { Thumbnails, YoutubeRawData } from "../../common";
import { BaseChannel } from "./BaseChannel";

type TabType = keyof typeof BaseChannelParser.TAB_TYPE_PARAMS;

export class BaseChannelParser {
	static TAB_TYPE_PARAMS = {
		videos: "EgZ2aWRlb3PyBgQKAjoA",
		shorts: "EgZzaG9ydHPyBgUKA5oBAA%3D%3D",
		live: "EgdzdHJlYW1z8gYECgJ6AA%3D%3D",
		playlists: "EglwbGF5bGlzdHPyBgQKAkIA",
		posts: "EgVwb3N0c_IGBAoCSgA%3D",
	} as const;

	static loadBaseChannel(target: BaseChannel, data: YoutubeRawData): BaseChannel {
		const { channelId, title, thumbnail, subscriberCountText } = data;

		target.id = channelId;
		target.name = title.simpleText;
		target.thumbnails = new Thumbnails().load(thumbnail.thumbnails);
		target.subscriberCount = subscriberCountText?.simpleText;

		return target;
	}

	/** Parse tab data from request, tab name is ignored if it's a continuation data */
	static parseTabData(name: TabType, data: YoutubeRawData): YoutubeRawData {
		const tab = data.contents?.twoColumnBrowseResultsRenderer.tabs.find((t: YoutubeRawData) => {
			return (
				t.tabRenderer?.endpoint.browseEndpoint.params ===
				BaseChannelParser.TAB_TYPE_PARAMS[name]
			);
		});

		return (
			tab?.tabRenderer.content.sectionListRenderer?.contents?.[0].itemSectionRenderer
				.contents[0].gridRenderer?.items ||
			tab?.tabRenderer.content?.sectionListRenderer?.contents?.[0].itemSectionRenderer
				?.contents ||
			tab?.tabRenderer.content.richGridRenderer.contents.map(
				(c: YoutubeRawData) => c.richItemRenderer?.content || c
			) ||
			data.onResponseReceivedActions?.[0].appendContinuationItemsAction.continuationItems.map(
				(c: YoutubeRawData) => c.richItemRenderer?.content || c
			) ||
			data.onResponseReceivedEndpoints?.[0].appendContinuationItemsAction.continuationItems ||
			[]
		);
	}
}
