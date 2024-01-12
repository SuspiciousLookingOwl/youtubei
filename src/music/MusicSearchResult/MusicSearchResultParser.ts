import { YoutubeRawData } from "../../common";
import { MusicClient } from "../MusicClient";
import { MusicAllSearchResultParser } from "./MusicAllSearchResultParser";
import { MusicSearchResultItem, MusicSearchType } from "./MusicSearchResult";

type ParseReturnType = {
	data: MusicSearchResultItem[];
	continuation: string | undefined;
};

export class MusicSearchResultParser {
	static parseInitialSearchResult(
		data: YoutubeRawData,
		type: MusicSearchType,
		client: MusicClient
	): ParseReturnType {
		const contentSection = data.contents.tabbedSearchResultsRenderer.tabs[0].tabRenderer.content.sectionListRenderer.contents.find(
			(c: YoutubeRawData) => "musicShelfRenderer" in c
		);

		if (!contentSection) {
			// no results
			return {
				data: [],
				continuation: undefined,
			};
		}

		const { contents, continuations } = contentSection.musicShelfRenderer;

		return {
			data: MusicSearchResultParser.parseSearchResult(contents, type, client),
			continuation: continuations?.[0]?.nextContinuationData?.continuation,
		};
	}

	static parseContinuationSearchResult(
		data: YoutubeRawData,
		type: MusicSearchType,
		client: MusicClient
	): ParseReturnType {
		const shelf = data.continuationContents.musicShelfContinuation;

		return {
			data: MusicSearchResultParser.parseSearchResult(shelf.contents, type, client),
			continuation: shelf.continuations[0].nextContinuationData.continuation,
		};
	}

	private static parseSearchResult(
		shelfContents: YoutubeRawData,
		type: MusicSearchType,
		client: MusicClient
	): MusicSearchResultItem[] {
		const rawContents = shelfContents
			.filter((c: Record<string, unknown>) => "musicResponsiveListItemRenderer" in c)
			.map((c: Record<string, unknown>) => c.musicResponsiveListItemRenderer);

		const contents: MusicSearchResultItem[] = [];

		for (const c of rawContents) {
			const parsed = MusicAllSearchResultParser.parseVideoItem(
				c,
				type === "video" ? "MUSIC_VIDEO_TYPE_UGC" : "MUSIC_VIDEO_TYPE_ATV",
				client
			);
			if (parsed) contents.push(parsed as MusicSearchResultItem);
		}

		return contents;
	}
}
