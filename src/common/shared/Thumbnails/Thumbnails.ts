import { extendsBuiltIn } from "../../utils";

export interface Thumbnail {
	url: string;
	width: number;
	height: number;
}

/**
 * Represents Thumbnails, usually found inside Playlist / Channel / Video, etc.
 *
 * {@link Thumbnails} is an array of {@link Thumbnail}
 *
 * @noInheritDoc
 */
@extendsBuiltIn()
export class Thumbnails extends Array<Thumbnail> {
	/** @hidden */
	constructor() {
		super();
	}

	/**
	 * Returns thumbnail with the lowest resolution, usually the first element of the Thumbnails array
	 *
	 * @example
	 * ```js
	 * const min = video.thumbnails.min;
	 * ```
	 */
	get min(): string | undefined {
		return Thumbnails.parseThumbnailUrl(this[0]);
	}

	/**
	 * Returns thumbnail with the highest resolution, usually the last element of the Thumbnails array
	 *
	 * @example
	 * ```js
	 * const best = video.thumbnails.best;
	 * ```
	 */
	get best(): string | undefined {
		return Thumbnails.parseThumbnailUrl(this[this.length - 1]);
	}

	/**
	 * Load this instance with raw data from Youtube
	 *
	 * @hidden
	 */
	load(thumbnails: Thumbnail[]): Thumbnails {
		this.push(...thumbnails);
		return this;
	}

	private static parseThumbnailUrl({ url }: Thumbnail) {
		if (url.startsWith("//")) return `https:${url}`;
		if (!url.startsWith("https://")) return `https://${url}`;
		else return url;
	}
}
