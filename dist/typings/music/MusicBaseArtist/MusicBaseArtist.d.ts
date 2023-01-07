import { MusicBase, MusicBaseProperties } from "../MusicBase";
/** @hidden */
export interface MusicBaseArtistProperties extends MusicBaseProperties {
    id?: string;
    name?: string;
}
export declare class MusicBaseArtist extends MusicBase implements MusicBaseArtistProperties {
    id: string;
    /** The name of this artist */
    name: string;
    /** @hidden */
    constructor(attr: MusicBaseArtistProperties);
}
