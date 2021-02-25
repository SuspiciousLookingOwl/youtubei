/** @hidden */
export interface BaseAttributes {
	id: string;
}

export default class Base implements BaseAttributes {
	id!: string;
}
