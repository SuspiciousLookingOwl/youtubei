import fetch, { Response as FetchResponse, HeadersInit, RequestInit } from "node-fetch";
import { URLSearchParams } from "url";

import { OAuth } from "./OAuth";

export type OAuthOptions = {
	enabled: boolean;
	refreshToken?: string;
};

type OAuthProps = {
	token: string | null;
	expiresAt: Date | null;
};

type HTTPOptions = {
	apiKey: string;
	baseUrl: string;
	clientName: string;
	clientVersion: string;
	fetchOptions?: Partial<RequestInit>;
	youtubeClientOptions?: Record<string, unknown>;
	initialCookie?: string;
	oauth?: OAuthOptions;
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type Response<T = any> = {
	data: T;
};

type Options = {
	data: Record<string, unknown>;
	params: Record<string, string>;
} & RequestInit;

/**
 * @hidden
 */
export class HTTP {
	private apiKey: string;
	private baseUrl: string;
	private clientName: string;
	private clientVersion: string;
	private cookie: string;
	private defaultHeaders: HeadersInit;
	private defaultFetchOptions: Partial<RequestInit>;
	private defaultClientOptions: Record<string, unknown>;
	private authorizationPromise: Promise<void> | null;
	public oauth: OAuthOptions & OAuthProps;

	constructor(options: HTTPOptions) {
		this.apiKey = options.apiKey;
		this.baseUrl = options.baseUrl;
		this.clientName = options.clientName;
		this.clientVersion = options.clientVersion;
		this.cookie = options.initialCookie || "";
		this.defaultHeaders = {
			"x-youtube-client-version": this.clientVersion,
			"x-youtube-client-name": "1",
			"content-type": "application/json",
			"accept-encoding": "gzip, deflate, br",
		};
		this.oauth = {
			enabled: false,
			token: null,
			expiresAt: null,
			...options.oauth,
		};
		this.authorizationPromise = null;
		this.defaultFetchOptions = options.fetchOptions || {};
		this.defaultClientOptions = options.youtubeClientOptions || {};
	}

	async get(path: string, options?: Partial<Options>): Promise<Response> {
		return await this.request(path, {
			...options,
			params: { prettyPrint: "false", ...options?.params },
			method: "GET",
		});
	}

	async post(path: string, options?: Partial<Options>): Promise<Response> {
		return await this.request(path, {
			...options,
			method: "POST",
			params: {
				key: this.apiKey,
				prettyPrint: "false",
				...options?.params,
			},
			data: {
				context: {
					client: {
						clientName: this.clientName,
						clientVersion: this.clientVersion,
						...this.defaultClientOptions,
					},
				},
				...options?.data,
			},
		});
	}

	private async request(path: string, partialOptions: Partial<Options>): Promise<Response> {
		if (this.authorizationPromise) await this.authorizationPromise;

		const options: RequestInit = {
			...partialOptions,
			...this.defaultFetchOptions,
			headers: {
				...this.defaultHeaders,
				cookie: this.cookie,
				referer: `https://${this.baseUrl}/`,
				...partialOptions.headers,
				...this.defaultFetchOptions.headers,
			},
			body: partialOptions.data ? JSON.stringify(partialOptions.data) : undefined,
		};

		if (this.oauth.enabled) {
			this.authorizationPromise = this.authorize();
			await this.authorizationPromise;

			if (this.oauth.token) {
				options.headers = {
					Authorization: `Bearer ${this.oauth.token}`,
				};
			}
		}

		// if URL is a full URL, ignore baseUrl
		let urlString: string;
		if (path.startsWith("http")) {
			const url = new URL(path);
			for (const [key, value] of Object.entries(partialOptions.params || {})) {
				url.searchParams.set(key, value);
			}
			urlString = url.toString();
		} else {
			urlString = `https://${this.baseUrl}/${path}?${new URLSearchParams(
				partialOptions.params
			)}`;
		}

		const response = await fetch(urlString, options);
		const data = await response.json();
		this.parseCookie(response);

		return { data };
	}

	private parseCookie(response: FetchResponse) {
		const cookie = response.headers.get("set-cookie");
		if (cookie) this.cookie = cookie;
	}

	private async authorize() {
		const isExpired =
			!this.oauth.expiresAt || this.oauth.expiresAt.getTime() - 5 * 60 * 1000 < Date.now();

		if (this.oauth.refreshToken && (isExpired || !this.oauth.token)) {
			const response = await OAuth.refreshToken(this.oauth.refreshToken);
			this.oauth.token = response.accessToken;
			this.oauth.expiresAt = new Date(Date.now() + response.expiresIn * 1000);
		} else if (isExpired || !this.oauth.token) {
			const response = await OAuth.authorize();
			this.oauth.token = response.accessToken;
			this.oauth.refreshToken = response.refreshToken;
			this.oauth.expiresAt = new Date(Date.now() + response.expiresIn * 1000);
		}
	}
}
