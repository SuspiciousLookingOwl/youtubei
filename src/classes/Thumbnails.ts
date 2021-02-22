import { extendsBuiltIn } from "../common";

interface Thumbnail {
	url: string;
	width: number;
	height: number;
}

@extendsBuiltIn()
export default class Thumbnails extends Array<Thumbnail> {
	load(thumbnails: Thumbnail[]): Thumbnails {
		this.push(...thumbnails);
		return this;
	}

	get best(): string {
		const thumbnail = this[this.length - 1].url;
		if (thumbnail.startsWith("//")) return `https:${thumbnail}`;
		if (!thumbnail.startsWith("https://")) return `https://${thumbnail}`;
		return thumbnail;
	}
}
