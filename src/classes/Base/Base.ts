import { Client } from "..";

/** @hidden */
export interface BaseAttributes {
	id: string;
	client: Client;
}

export class Base implements BaseAttributes {
	id!: string;
	client!: Client;
}
