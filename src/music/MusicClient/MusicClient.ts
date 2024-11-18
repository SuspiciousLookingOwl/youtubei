import { RequestInit } from "node-fetch";

import { HTTP, HTTPOptions, Shelf } from "../../common";
import { MusicAlbumCompact } from "../MusicAlbumCompact";
import { MusicArtistCompact } from "../MusicArtistCompact";
import { MusicLyrics } from "../MusicLyrics";
import { MusicPlaylistCompact } from "../MusicPlaylistCompact";
import {
	MusicAllSearchResultParser,
	MusicSearchResult,
	MusicSearchType,
} from "../MusicSearchResult";
import { MusicVideoCompact } from "../MusicVideoCompact";
import {
	BASE_URL,
	INNERTUBE_API_KEY,
	INNERTUBE_CLIENT_NAME,
	INNERTUBE_CLIENT_VERSION,
	I_END_POINT,
} from "../constants";

export type MusicTopShelf = {
	item?: MusicVideoCompact | MusicAlbumCompact | MusicPlaylistCompact | MusicArtistCompact;
	more?: (MusicVideoCompact | MusicAlbumCompact | MusicPlaylistCompact | MusicArtistCompact)[];
};

export type MusicClientOptions = HTTPOptions;

/** Youtube Music Client */
export class MusicClient {
	/** @hidden */
	http: HTTP;

	constructor(options: Partial<MusicClientOptions> = {}) {
		const fullOptions: MusicClientOptions = {
			initialCookie: "",
			oauth: { enabled: false },
			fetchOptions: {},
			...options,
			youtubeClientOptions: {
				hl: "en",
				gl: "US",
				...options.youtubeClientOptions,
			},
			apiKey: options.apiKey || INNERTUBE_API_KEY,
			baseUrl: options.baseUrl || BASE_URL,
			clientName: options.clientName || INNERTUBE_CLIENT_NAME,
			clientVersion: options.clientVersion || INNERTUBE_CLIENT_VERSION,
		};

		this.http = new HTTP(fullOptions);
	}

	/**
	 * Searches for video, song, album, playlist, or artist
	 *
	 * @param query The search query
	 * @param type Search type
	 *
	 */
	async search(
		query: string
	): Promise<
		Shelf<
			| MusicVideoCompact[]
			| MusicAlbumCompact[]
			| MusicPlaylistCompact[]
			| MusicArtistCompact[]
		>[]
	>;
	async search<T extends MusicSearchType>(query: string, type: T): Promise<MusicSearchResult<T>>;
	async search<T extends MusicSearchType>(
		query: string,
		type?: T
	): Promise<
		| Shelf<
				| MusicVideoCompact[]
				| MusicAlbumCompact[]
				| MusicPlaylistCompact[]
				| MusicArtistCompact[]
		  >[]
		| MusicSearchResult<T>
	> {
		if (!type) {
			const response = await this.http.post(`${I_END_POINT}/search`, {
				data: { query },
			});

			return MusicAllSearchResultParser.parseSearchResult(response.data, this);
		} else {
			const result = new MusicSearchResult<T>({ client: this });
			await result.search(query, type);
			return result;
		}
	}

	/**
	 * Searches for all video, song, album, playlist, or artist
	 *
	 * @param query The search query
	 */
	async searchAll(
		query: string
	): Promise<{
		top?: MusicTopShelf;
		shelves: Shelf<
			| MusicVideoCompact[]
			| MusicAlbumCompact[]
			| MusicPlaylistCompact[]
			| MusicArtistCompact[]
		>[];
	}> {
		const response = await this.http.post(`${I_END_POINT}/search`, {
			data: { query },
		});

		return {
			top: MusicAllSearchResultParser.parseTopResult(response.data, this),
			shelves: MusicAllSearchResultParser.parseSearchResult(response.data, this),
		};
	}

	/**
	 * Get lyrics of a song
	 *
	 * @param query The search query
	 * @param options Search options
	 *
	 */
	async getLyrics(id: string): Promise<MusicLyrics | undefined> {
		// get watch page data to obtain lyric browse id
		const watchResponse = await this.http.post(`${I_END_POINT}/next`, {
			data: { videoId: id },
		});

		const lyricTab =
			watchResponse.data.contents.singleColumnMusicWatchNextResultsRenderer.tabbedRenderer
				.watchNextTabbedResultsRenderer.tabs[1].tabRenderer;

		if (lyricTab.unselectable) return undefined;

		// get lyric data with browse id
		const lyricsBrowseId = lyricTab.endpoint.browseEndpoint.browseId;
		const lyricResponse = await this.http.post(`${I_END_POINT}/browse`, {
			data: { browseId: lyricsBrowseId },
		});

		const data =
			lyricResponse.data.contents.sectionListRenderer.contents[0]
				.musicDescriptionShelfRenderer;

		const content = data.description.runs[0].text;
		const description = data.footer.runs[0].text;

		return new MusicLyrics({
			content,
			description,
		});
	}
}
