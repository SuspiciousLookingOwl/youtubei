import { RequestInit } from "node-fetch";
export declare type OAuthOptions = {
    enabled: boolean;
    refreshToken?: string;
};
export declare type OAuthProps = {
    token: string | null;
    expiresAt: Date | null;
    refreshToken?: string;
};
export declare type PotOptions = {
    token: string;
    visitorData: string;
};
export declare type HTTPOptions = {
    apiKey: string;
    baseUrl: string;
    clientName: string;
    clientVersion: string;
    fetchOptions?: Partial<RequestInit>;
    youtubeClientOptions?: Record<string, unknown>;
    initialCookie?: string;
    oauth?: OAuthOptions;
    pot?: PotOptions;
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
    private authorizationPromise;
    private pot?;
    oauth: OAuthOptions & OAuthProps;
    constructor(options: HTTPOptions);
    get(path: string, options?: Partial<Options>): Promise<Response>;
    post(path: string, options?: Partial<Options>): Promise<Response>;
    private request;
    private parseCookie;
    private authorize;
}
export {};
