import { Client } from ".";

/** @hidden */
export interface BaseAttributes {
	id: string;
	client: Client;
}

export default class Base implements BaseAttributes {
	id!: string;
	client!: Client;
}
