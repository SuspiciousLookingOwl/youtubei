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
export declare class VideoCaptions extends Base {
    /** The video this captions belongs to */
    video?: BaseVideo;
    /** List of available languages for this video */
    languages: Array<CaptionLanguage>;
    /** @hidden */
    constructor({ video, client }: ConstructorParams);
    /**
     * Load this instance with raw data from Youtube
     *
     * @hidden
     */
    load(data: YoutubeRawData): VideoCaptions;
    /**
     * Get captions of a specific language or a translation of a specific language
     */
    get(languageCode?: string, translationLanguageCode?: string): Promise<Caption[] | undefined>;
}
export {};
