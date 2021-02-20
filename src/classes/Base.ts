import { Thumbnail } from "../common";

export default class Base {
	id!: string;
	thumbnails!: Thumbnail[];

	/**
	 * Returns thumbnail with the highest resolution
	 */
	get thumbnail(): string {
		const thumbnail = this.thumbnails[this.thumbnails.length - 1].url;
		if (thumbnail.startsWith("//")) return `https:${thumbnail}`;
		if (!thumbnail.startsWith("https://")) return `https://${thumbnail}`;
		return thumbnail;
	}
	// To prevent error because of Object.assign from subclass
	set thumbnail(_val: string) {
		return;
	}
}
