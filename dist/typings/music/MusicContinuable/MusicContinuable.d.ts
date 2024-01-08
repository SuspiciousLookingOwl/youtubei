import { MusicBase } from "../MusicBase";
import { MusicClient } from "../MusicClient";
/** @hidden */
export declare type FetchResult<T> = {
    items: T[];
    continuation?: string;
};
/** @hidden */
export declare type MusicContinuableConstructorParams = {
    client: MusicClient;
    strictContinuationCheck?: boolean;
};
/** Represents a continuable list of items `T` (like pagination) */
export declare abstract class MusicContinuable<T> extends MusicBase {
    items: T[];
    continuation?: string | null;
    private strictContinuationCheck;
    /** @hidden */
    constructor({ client, strictContinuationCheck }: MusicContinuableConstructorParams);
    /** Fetch next items using continuation token */
    next(count?: number): Promise<T[]>;
    protected abstract fetch(): Promise<FetchResult<T>>;
    private get hasContinuation();
}
