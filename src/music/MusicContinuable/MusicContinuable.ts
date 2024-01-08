import { MusicBase } from "../MusicBase";
import { MusicClient } from "../MusicClient";

/** @hidden */
export type FetchResult<T> = {
	items: T[];
	continuation?: string;
};

/** @hidden */
export type MusicContinuableConstructorParams = {
	client: MusicClient;
	strictContinuationCheck?: boolean;
};

/** Represents a continuable list of items `T` (like pagination) */
export abstract class MusicContinuable<T> extends MusicBase {
	items: T[] = [];
	continuation?: string | null;

	private strictContinuationCheck;

	/** @hidden */
	constructor({ client, strictContinuationCheck }: MusicContinuableConstructorParams) {
		super(client);

		this.strictContinuationCheck = !!strictContinuationCheck;
		if (this.strictContinuationCheck) this.continuation = null;
	}

	/** Fetch next items using continuation token */
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

	protected abstract fetch(): Promise<FetchResult<T>>;

	private get hasContinuation(): boolean {
		return this.strictContinuationCheck ? this.continuation !== undefined : !!this.continuation;
	}
}
