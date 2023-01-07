import { MusicBase, MusicBaseProperties } from "../MusicBase";
/** @hidden */
export interface MusicBaseAlbumProperties extends MusicBaseProperties {
    id?: string;
    title?: string;
}
export declare class MusicBaseAlbum extends MusicBase implements MusicBaseAlbumProperties {
    id: string;
    /** The title of this album */
    title: string;
    /** @hidden */
    constructor(attr: MusicBaseAlbumProperties);
}
