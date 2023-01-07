import { Thumbnails } from "../../common";
import { MusicBaseAlbum, MusicBaseAlbumProperties } from "../MusicBaseAlbum";
import { MusicBaseArtist } from "../MusicBaseArtist";
/** @hidden */
export interface MusicAlbumCompactProperties extends MusicBaseAlbumProperties {
    year?: number;
    thumbnails?: Thumbnails;
    artists?: MusicBaseArtist[];
}
export declare class MusicAlbumCompact extends MusicBaseAlbum implements MusicAlbumCompactProperties {
    /** The year of this album */
    year: number;
    /** The album's thumbnails */
    thumbnails: Thumbnails;
    /** The artists of this album */
    artists: MusicBaseArtist[];
    /** @hidden */
    constructor(attr: MusicAlbumCompactProperties);
}
