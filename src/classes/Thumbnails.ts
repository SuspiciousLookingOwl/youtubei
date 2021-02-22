import { extendsBuiltIn } from "../common";

interface Thumbnail {
	url: string;
	width: number;
	height: number;
}

@extendsBuiltIn()
/**
 * Represents Thumbnails, usually found inside Playlist / Channel / Video, etc.
 *
 * @noInheritDoc
 */
export default class Thumbnails extends Array<Thumbnail> {
	/** @hidden */
	constructor() {
		super();
	}

	/** Load instance attributes from youtube raw data */
	load(thumbnails: Thumbnail[]): Thumbnails {
		this.push(...thumbnails);
		return this;
	}

	/** Returns thumbnail with the highest resolution */
	get best(): string {
		const thumbnail = this[this.length - 1].url;
		if (thumbnail.startsWith("//")) return `https:${thumbnail}`;
		if (!thumbnail.startsWith("https://")) return `https://${thumbnail}`;
		return thumbnail;
	}
}
