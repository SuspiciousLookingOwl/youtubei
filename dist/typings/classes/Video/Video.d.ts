import { Thumbnails, YoutubeRawData } from "../../common";
import { BaseVideo, BaseVideoProperties } from "../BaseVideo";
import { Transcript } from "../Transcript";
import { VideoComments } from "./VideoComments";
export declare type Chapter = {
    title: string;
    start: number;
    thumbnails: Thumbnails;
};
/** @hidden */
interface VideoProperties extends BaseVideoProperties {
    duration?: number;
    comments?: VideoComments;
    chapters?: Chapter[];
}
/** Represents a Video, usually returned from `client.getVideo()`  */
export declare class Video extends BaseVideo implements VideoProperties {
    /** The duration of this video in second */
    duration: number;
    /** Chapters on this video if exists */
    chapters: Chapter[];
    /** {@link Continuable} of videos inside a {@link Video} */
    comments: VideoComments;
    /** @hidden */
    constructor(attr: VideoProperties);
    /**
     * Load this instance with raw data from Youtube
     *
     * @hidden
     */
    load(data: YoutubeRawData): Video;
    /**
     * Get Video transcript (if exists)
     *
     * Equivalent to
     * ```js
     * client.getVideoTranscript(video.id);
     * ```
     */
    getTranscript(): Promise<Transcript[] | undefined>;
}
export {};
