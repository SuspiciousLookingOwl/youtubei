import { Thumbnails } from "../../common";
import { MusicBase, MusicBaseProperties } from "../MusicBase";
import { MusicBaseArtist } from "../MusicBaseArtist";
/** @hidden */
export interface MusicVideoCompactProperties extends MusicBaseProperties {
    id?: string;
    title?: string;
    duration?: number;
    thumbnails?: Thumbnails;
    artists?: MusicBaseArtist[];
}
export declare class MusicVideoCompact extends MusicBase implements MusicVideoCompactProperties {
    id: string;
    /** The title's name */
    title: string;
    /** The duration of the video (in seconds) */
    duration: number;
    /** The thumbnails of the video */
    thumbnails: Thumbnails;
    /** The artists of the video */
    artists?: MusicBaseArtist[];
    /** @hidden */
    constructor(attr: MusicVideoCompactProperties);
}
