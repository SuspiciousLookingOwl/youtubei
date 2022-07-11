import { getContinuationFromItems, YoutubeRawData } from "../../common";
import { BaseChannel } from "../BaseChannel";
import { Client } from "../Client";
import { PlaylistCompact } from "../PlaylistCompact";
import { VideoCompact } from "../VideoCompact";
import { SearchResultType } from "./SearchResult";

export class SearchResultParser {
	static parseInitialSearchResult(data: YoutubeRawData, client: Client): SearchResultType[] {
		const sectionListContents =
			data.contents.twoColumnSearchResultsRenderer.primaryContents.sectionListRenderer
				.contents;

		return SearchResultParser.parseSearchResult(sectionListContents, client);
	}

	static parseContinuationSearchResult(data: YoutubeRawData, client: Client): SearchResultType[] {
		const sectionListContents =
			data.onResponseReceivedCommands[0].appendContinuationItemsAction.continuationItems;

		return SearchResultParser.parseSearchResult(sectionListContents, client);
	}

	static parseInitialContinuation(data: YoutubeRawData): string | undefined {
		const sectionListContents =
			data.contents.twoColumnSearchResultsRenderer.primaryContents.sectionListRenderer
				.contents;

		return getContinuationFromItems(sectionListContents);
	}

	static parseContinuation(data: YoutubeRawData): string | undefined {
		const sectionListContents =
			data.onResponseReceivedCommands[0].appendContinuationItemsAction.continuationItems;

		return getContinuationFromItems(sectionListContents);
	}

	private static parseSearchResult(
		sectionListContents: YoutubeRawData,
		client: Client
	): SearchResultType[] {
		const rawContents = sectionListContents
			.filter((c: Record<string, unknown>) => "itemSectionRenderer" in c)
			.at(-1).itemSectionRenderer.contents;

		const contents: SearchResultType[] = [];

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
