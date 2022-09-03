import { RequestInit } from "node-fetch";
import { ClientOptions } from "./Client";
declare type Response<T = any> = {
    data: T;
};
declare type Options = {
    data: Record<string, unknown>;
    params: Record<string, string>;
} & RequestInit;
export declare class HTTP {
    private cookie;
    private defaultHeaders;
    private defaultFetchOptions;
    private defaultClientOptions;
    constructor(options: ClientOptions);
    get(url: string, options?: Partial<Options>): Promise<Response>;
    post(url: string, options?: Partial<Options>): Promise<Response>;
    private request;
    private parseCookie;
}
export {};
