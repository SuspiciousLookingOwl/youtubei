import { RequestInit } from "node-fetch";
declare type HTTPOptions = {
    apiKey: string;
    baseUrl: string;
    clientName: string;
    clientVersion: string;
    fetchOptions?: Partial<RequestInit>;
    youtubeClientOptions?: Record<string, unknown>;
    initialCookie?: string;
};
declare type Response<T = any> = {
    data: T;
};
declare type Options = {
    data: Record<string, unknown>;
    params: Record<string, string>;
} & RequestInit;
/**
 * @hidden
 */
export declare class HTTP {
    private apiKey;
    private baseUrl;
    private clientName;
    private clientVersion;
    private cookie;
    private defaultHeaders;
    private defaultFetchOptions;
    private defaultClientOptions;
    constructor(options: HTTPOptions);
    get(url: string, options?: Partial<Options>): Promise<Response>;
    post(url: string, options?: Partial<Options>): Promise<Response>;
    private request;
    private parseCookie;
}
export {};
