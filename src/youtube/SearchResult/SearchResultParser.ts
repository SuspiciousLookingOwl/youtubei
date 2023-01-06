import { getContinuationFromItems, YoutubeRawData } from "../../common";
import { BaseChannel } from "../BaseChannel";
import { Client } from "../Client";
import { PlaylistCompact } from "../PlaylistCompact";
import { VideoCompact } from "../VideoCompact";
import { SearchResultItem } from "./SearchResult";

type ParseReturnType = {
	data: SearchResultItem[];
	continuation: string | undefined;
};

export class SearchResultParser {
	static parseInitialSearchResult(data: YoutubeRawData, client: Client): ParseReturnType {
		const sectionListContents =
			data.contents.twoColumnSearchResultsRenderer.primaryContents.sectionListRenderer
				.contents;

		return {
			data: SearchResultParser.parseSearchResult(sectionListContents, client),
			continuation: getContinuationFromItems(sectionListContents),
		};
	}

	static parseContinuationSearchResult(data: YoutubeRawData, client: Client): ParseReturnType {
		const sectionListContents =
			data.onResponseReceivedCommands[0].appendContinuationItemsAction.continuationItems;

		return {
			data: SearchResultParser.parseSearchResult(sectionListContents, client),
			continuation: getContinuationFromItems(sectionListContents),
		};
	}

	private static parseSearchResult(
		sectionListContents: YoutubeRawData,
		client: Client
	): SearchResultItem[] {
		const rawContents = sectionListContents
			.filter((c: Record<string, unknown>) => "itemSectionRenderer" in c)
			.at(-1).itemSectionRenderer.contents;

		const contents: SearchResultItem[] = [];

		for (const c of rawContents) {
			if ("playlistRenderer" in c)
				contents.push(new PlaylistCompact({ client }).load(c.playlistRenderer));
			else if ("videoRenderer" in c)
				contents.push(new VideoCompact({ client }).load(c.videoRenderer));
			else if ("channelRenderer" in c)
				contents.push(new BaseChannel({ client }).load(c.channelRenderer));
		}

		return contents;
	}
}
