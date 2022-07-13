import { Client } from "../Client";

/** @hidden */
export type FetchReturnType<T> = Promise<{
	items: T[];
	continuation?: string;
}>;

/** @hidden */
export type ContinuableConstructorParams = {
	client: Client;
	strictContinuationCheck?: boolean;
};

/** Represents a continuable list of items ({@link T[]}) (like pagination) */
export abstract class Continuable<T> {
	client: Client;
	items: T[] = [];
	continuation?: string | null;

	private strictContinuationCheck;

	constructor({ client, strictContinuationCheck }: ContinuableConstructorParams) {
		this.client = client;

		this.strictContinuationCheck = !!strictContinuationCheck;
		if (this.strictContinuationCheck) this.continuation = null;
	}

	async next(count = 1): Promise<T[]> {
		const newItems: T[] = [];
		for (let i = 0; i < count || count == 0; i++) {
			if (!this.hasContinuation) break;

			const { items, continuation } = await this.fetch();
			this.continuation = continuation;
			newItems.push(...items);
		}

		this.items.push(...newItems);
		return newItems;
	}

	protected abstract fetch(): FetchReturnType<T>;

	private get hasContinuation(): boolean {
		return this.strictContinuationCheck ? this.continuation !== undefined : !!this.continuation;
	}
}
