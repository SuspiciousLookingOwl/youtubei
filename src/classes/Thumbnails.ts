import { extendsBuiltIn } from "../common";

interface Thumbnail {
	url: string;
	width: number;
	height: number;
}

/**
 * Represents Thumbnails, usually found inside Playlist / Channel / Video, etc.
 *
 * @noInheritDoc
 */
@extendsBuiltIn()
export default class Thumbnails extends Array<Thumbnail> {
	/** @hidden */
	constructor() {
		super();
	}

	/**
	 * Load instance attributes from youtube raw data
	 *
	 * @hidden
	 */
	load(thumbnails: Thumbnail[]): Thumbnails {
		this.push(...thumbnails);
		return this;
	}

	/** Returns thumbnail with the lowest resolution, usually the first element of the Thumbnails array */
	get min(): string | undefined {
		return Thumbnails.parseThumbnailUrl(this[0]);
	}

	/** Returns thumbnail with the highest resolution, usually the last element of the Thumbnails array */
	get best(): string | undefined {
		return Thumbnails.parseThumbnailUrl(this[this.length - 1]);
	}

	private static parseThumbnailUrl({ url }: Thumbnail) {
		if (url.startsWith("//")) return `https:${url}`;
		if (!url.startsWith("https://")) return `https://${url}`;
	}
}
