import { YoutubeRawData } from "../../common";
/** @hidden */
interface TranscriptProperties {
    text?: string;
    start?: number;
    duration?: number;
}
/**
 * Represent a single video transcript entry
 */
export declare class Transcript implements TranscriptProperties {
    /** transcript content */
    text: string;
    /** transcript start time in miliseconds */
    start: number;
    /** transcript duration in miliseconds */
    duration: number;
    /** @hidden */
    constructor(attr?: TranscriptProperties);
    /** transcript end time in miliseconds */
    get end(): number;
    /**
     * Load this instance with raw data from Youtube
     *
     * @hidden
     */
    load(data: YoutubeRawData): Transcript;
}
export {};
