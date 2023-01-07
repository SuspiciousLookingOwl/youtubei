import { Thumbnails } from "../../common";
import { MusicBase, MusicBaseProperties } from "../MusicBase";
import { MusicBaseChannel } from "../MusicBaseChannel";
/** @hidden */
export interface MusicPlaylistCompactProperties extends MusicBaseProperties {
    id?: string;
    title?: string;
    songCount?: number;
    thumbnails?: Thumbnails;
    channel?: MusicBaseChannel;
}
export declare class MusicPlaylistCompact extends MusicBase implements MusicPlaylistCompactProperties {
    id: string;
    /** The title's name */
    title: string;
    /** The number of videos in this playlist */
    songCount: number;
    /** The playlist's thumbnails */
    thumbnails: Thumbnails;
    /** The channel that made this playlist */
    channel?: MusicBaseChannel;
    /** @hidden */
    constructor(attr: MusicPlaylistCompactProperties);
}
