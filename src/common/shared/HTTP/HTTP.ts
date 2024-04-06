import fetch, { Response as FetchResponse, HeadersInit, RequestInit } from "node-fetch";
import { URLSearchParams } from "url";

type HTTPOptions = {
	apiKey: string;
	baseUrl: string;
	clientName: string;
	clientVersion: string;
	fetchOptions?: Partial<RequestInit>;
	youtubeClientOptions?: Record<string, unknown>;
	initialCookie?: string;
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
}
