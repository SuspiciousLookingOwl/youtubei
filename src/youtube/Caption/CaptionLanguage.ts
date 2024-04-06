import { VideoCaptions } from "../BaseVideo";
import { Caption } from "./Caption";

/** @hidden */
interface CaptionLanguageProperties {
	name?: string;
	code?: string;
	isTranslatable?: boolean;
	url?: string;
	captions?: VideoCaptions;
}

/**
 * Represents a caption language option
 */
export class CaptionLanguage implements CaptionLanguageProperties {
	/** Caption language name */
	name!: string;
	/** Caption language code */
	code!: string;
	/** Whether this language is translatable */
	isTranslatable!: boolean;
	/** Caption language url */
	url!: string;
	/** @hidden */
	captions!: VideoCaptions;

	/** @hidden */
	constructor(attr?: CaptionLanguageProperties) {
		Object.assign(this, attr);
	}

	/** Get the captions of this language using the url */
	get(translationLanguageCode?: string): Promise<Caption[] | undefined> {
		return this.captions.get(this.code, translationLanguageCode);
	}
}
