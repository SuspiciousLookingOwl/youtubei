import { YoutubeRawData } from "../../common";
import { Base } from "../Base";
import { BaseVideo } from "../BaseVideo";
import { Caption, CaptionLanguage } from "../Caption";
import { Client } from "../Client";

/** @hidden */
interface ConstructorParams {
	client: Client;
	video?: BaseVideo;
}

/**
 * Captions of a video
 *
 * @example
 * ```js
 *
 * console.log(video.captions.languages.map((l) => `${l.code} - ${l.name}`)); // printing out available languages for captions
 *
 * console.log(await video.captions.get("en")); // printing out captions of a specific language using language code
 * ```
 */
export class VideoCaptions extends Base {
	/** The video this captions belongs to */
	video?: BaseVideo;
	/** List of available languages for this video */
	languages: Array<CaptionLanguage>;

	/** @hidden */
	constructor({ video, client }: ConstructorParams) {
		super(client);
		this.video = video;
		this.languages = [];
	}

	/**
	 * Load this instance with raw data from Youtube
	 *
	 * @hidden
	 */
	load(data: YoutubeRawData): VideoCaptions {
		const { captionTracks } = data;

		if (captionTracks) {
			this.languages = captionTracks.map(
				(track: YoutubeRawData) =>
					new CaptionLanguage({
						captions: this,
						name: track.name.simpleText,
						code: track.languageCode,
						isTranslatable: !!track.isTranslatable,
						url: track.baseUrl,
					})
			);
		}

		return this;
	}

	/**
	 * Get captions of a specific language or a translation of a specific language
	 */
	async get(
		languageCode?: string,
		translationLanguageCode?: string
	): Promise<Caption[] | undefined> {
		if (!languageCode) languageCode = this.client.options.youtubeClientOptions.hl;

		const url = this.languages.find((l) => l.code.toUpperCase() === languageCode?.toUpperCase())
			?.url;
		if (!url) return undefined;

		const params: Record<string, string> = { fmt: "json3" };
		if (translationLanguageCode) params["tlang"] = translationLanguageCode;

		const response = await this.client.http.get(url, { params });
		const captions = response.data.events?.reduce((curr: Array<Caption>, e: YoutubeRawData) => {
			if (e.segs === undefined) return curr;
			curr.push(
				new Caption({
					duration: e.dDurationMs,
					start: e.tStartMs,
					text: e.segs?.map((s: YoutubeRawData) => Object.values(s).join("")).join(" "),
				})
			);
			return curr;
		}, []);

		return captions;
	}
}
