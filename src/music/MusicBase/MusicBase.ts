import { MusicClient } from "../MusicClient";

/** @hidden */
export interface MusicBaseProperties {
	client: MusicClient;
}

export class MusicBase implements MusicBaseProperties {
	/** An instance of {@link MusicClient} */
	client: MusicClient;

	/** @hidden */
	constructor(client: MusicClient) {
		this.client = client;
	}
}
