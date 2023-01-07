import { MusicBase, MusicBaseProperties } from "../MusicBase";

/** @hidden */
export interface MusicBaseArtistProperties extends MusicBaseProperties {
	id?: string;
	name?: string;
}

export class MusicBaseArtist extends MusicBase implements MusicBaseArtistProperties {
	id!: string;
	/** The name of this artist */
	name!: string;

	/** @hidden */
	constructor(attr: MusicBaseArtistProperties) {
		super(attr.client);
		Object.assign(this, attr);
	}
}
