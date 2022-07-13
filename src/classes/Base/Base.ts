import { Client } from "../Client";

/** @hidden */
export interface BaseProperties {
	client: Client;
}

export class Base implements BaseProperties {
	client: Client;

	constructor(client: Client) {
		this.client = client;
	}
}
