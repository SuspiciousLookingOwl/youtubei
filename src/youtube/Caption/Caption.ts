/** @hidden */
interface CaptionProperties {
	text?: string;
	start?: number;
	duration?: number;
}

/**
 * Represent a single video caption entry
 */
export class Caption implements CaptionProperties {
	/** caption content */
	text!: string;
	/** caption start time in milliseconds */
	start!: number;
	/** caption duration in milliseconds */
	duration!: number;

	/** @hidden */
	constructor(attr?: CaptionProperties) {
		Object.assign(this, attr);
	}

	/** transcript end time in milliseconds */
	get end(): number {
		return this.start + this.duration;
	}
}
