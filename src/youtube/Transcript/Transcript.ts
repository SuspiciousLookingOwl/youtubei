import { YoutubeRawData } from "../../common";
import { TranscriptParser } from "./TranscriptParser";

/** @hidden */
interface TranscriptProperties {
	text?: string;
	start?: number;
	duration?: number;
}

/**
 * Represent a single video transcript entry
 */
export class Transcript implements TranscriptProperties {
	/** transcript content */
	text!: string;
	/** transcript start time in miliseconds */
	start!: number;
	/** transcript duration in miliseconds */
	duration!: number;

	/** @hidden */
	constructor(attr?: TranscriptProperties) {
		Object.assign(this, attr);
	}

	/** transcript end time in miliseconds */
	get end(): number {
		return this.start + this.duration;
	}

	/**
	 * Load this instance with raw data from Youtube
	 *
	 * @hidden
	 */
	load(data: YoutubeRawData): Transcript {
		TranscriptParser.loadTranscript(this, data);
		return this;
	}
}
