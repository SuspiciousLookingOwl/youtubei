import { Thumbnails } from "../../common";
import { MusicBase, MusicBaseProperties } from "../MusicBase";
import { MusicBaseAlbum } from "../MusicBaseAlbum";
import { MusicBaseArtist } from "../MusicBaseArtist";
/** @hidden */
export interface MusicSongCompactProperties extends MusicBaseProperties {
    id?: string;
    title?: string;
    duration?: number;
    thumbnails?: Thumbnails;
    artists?: MusicBaseArtist[];
    album?: MusicBaseAlbum;
}
export declare class MusicSongCompact extends MusicBase implements MusicSongCompactProperties {
    id: string;
    /** The title's name */
    title: string;
    /** The duration of the song (in seconds) */
    duration: number;
    /** The thumbnails of the song */
    thumbnails: Thumbnails;
    /** The artists of the song */
    artists: MusicBaseArtist[];
    /** The album of the song */
    album: MusicBaseAlbum;
    /** @hidden */
    constructor(attr: MusicSongCompactProperties);
}
