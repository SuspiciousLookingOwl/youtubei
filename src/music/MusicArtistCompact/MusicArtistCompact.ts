import { Thumbnails } from "../../common";
import { MusicBaseArtist, MusicBaseArtistProperties } from "../MusicBaseArtist/MusicBaseArtist";

/** @hidden */
export interface MusicArtistCompactProperties extends MusicBaseArtistProperties {
	thumbnails?: Thumbnails;
}

export class MusicArtistCompact extends MusicBaseArtist implements MusicArtistCompactProperties {
	/** The thumbnails of the artist */
	thumbnails?: Thumbnails;

	/** @hidden */
	constructor(attr: MusicArtistCompactProperties) {
		super(attr);
		Object.assign(this, attr);
	}
}
