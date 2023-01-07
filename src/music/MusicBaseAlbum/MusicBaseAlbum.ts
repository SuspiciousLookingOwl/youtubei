import { MusicBase, MusicBaseProperties } from "../MusicBase";

/** @hidden */
export interface MusicBaseAlbumProperties extends MusicBaseProperties {
	id?: string;
	title?: string;
}

export class MusicBaseAlbum extends MusicBase implements MusicBaseAlbumProperties {
	id!: string;
	/** The title of this album */
	title!: string;

	/** @hidden */
	constructor(attr: MusicBaseAlbumProperties) {
		super(attr.client);
		Object.assign(this, attr);
	}
}
