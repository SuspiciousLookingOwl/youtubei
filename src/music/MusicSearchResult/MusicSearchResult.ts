import {
	FetchResult,
	MusicContinuable,
	MusicContinuableConstructorParams,
} from "../MusicContinuable";
import { MusicSongCompact } from "../MusicSongCompact";
import { MusicVideoCompact } from "../MusicVideoCompact";
import { I_END_POINT } from "../constants";
import { MusicSearchResultParser } from "./MusicSearchResultParser";
import { MusicSearchProto, optionsToProto } from "./proto";

export enum MusicSearchTypeEnum {
	Song = "song",
	Video = "video",
}

export type MusicSearchType = "song" | "video" | MusicSearchTypeEnum;

export type MusicSearchResultItem<T = "song"> = T extends "song"
	? MusicSongCompact
	: MusicVideoCompact;

type MusicLyricsProperties = MusicContinuableConstructorParams & {
	type?: MusicSearchType;
};

/**
 * Represents search result, usually returned from `client.search();`.
 *
 * {@link MusicSearchResult} is a helper class to manage search result
 *
 * @example
 * ```ts
 * const result = await music.search("Keyword", "song");
 *
 * console.log(result.items); // search result from first page
 *
 * let nextSearchResult = await result.next();
 * console.log(nextSearchResult); // search result from second page
 *
 * nextSearchResult = await result.next();
 * console.log(nextSearchResult); // search result from third page
 *
 * console.log(result.items); // search result from first, second, and third page.
 * ```
 *
 * @noInheritDoc
 */
export class MusicSearchResult<
	T extends MusicSearchType | undefined = "song"
> extends MusicContinuable<MusicSearchResultItem<T>> {
	private type!: MusicSearchType;

	/** @hidden */
	constructor({ client, type }: MusicLyricsProperties) {
		super({ client });
		if (type) this.type = type;
	}

	/**
	 * Initialize data from search
	 *
	 * @param query Search query
	 * @param options Search Options
	 *
	 * @hidden
	 */
	async search(query: string, type: MusicSearchType): Promise<MusicSearchResult<T>> {
		this.items = [];
		this.type = type;

		const bufferParams = MusicSearchProto.encode(optionsToProto(type)).finish();

		const response = await this.client.http.post(`${I_END_POINT}/search`, {
			data: {
				query,
				params: Buffer.from(bufferParams).toString("base64"),
			},
		});

		const { data, continuation } = MusicSearchResultParser.parseInitialSearchResult(
			response.data,
			type,
			this.client
		);
		this.items.push(...(data as MusicSearchResultItem<T>[]));
		this.continuation = continuation;

		return this;
	}

	protected async fetch(): Promise<FetchResult<MusicSearchResultItem<T>>> {
		if (!this.type) {
			return {
				items: [],
				continuation: undefined,
			};
		}

		const response = await this.client.http.post(`${I_END_POINT}/search`, {
			data: { continuation: this.continuation },
		});

		const { data, continuation } = MusicSearchResultParser.parseContinuationSearchResult(
			response.data,
			this.type,
			this.client
		);

		return {
			items: (data as unknown) as MusicSearchResultItem<T>[],
			continuation,
		};
	}
}
