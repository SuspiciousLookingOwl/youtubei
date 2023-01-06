import { Client } from "../Client";

/** @hidden */
export interface BaseProperties {
	client: Client;
}

export class Base implements BaseProperties {
	/** An instance of {@link Client} */
	client: Client;

	/** @hidden */
	constructor(client: Client) {
		this.client = client;
	}
}
