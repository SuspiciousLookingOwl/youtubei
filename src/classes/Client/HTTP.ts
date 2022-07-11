import fetch, { RequestInit, Response as FetchResponse, HeadersInit } from "node-fetch";
import { URLSearchParams } from "url";

import { BASE_URL, INNERTUBE_API_KEY, INNERTUBE_CLIENT_VERSION } from "../../constants";
import { Client } from "./Client";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type Response<T = any> = {
	data: T;
};

type Options = {
	data: Record<string, unknown>;
	params: Record<string, string>;
} & RequestInit;

export class HTTP {
	private cookie: string;
	private defaultHeaders: HeadersInit;
	private defaultFetchOptions: Partial<RequestInit>;
	private defaultClientOptions: Record<string, unknown>;

	constructor(options: Client.ClientOptions) {
		this.cookie = options.initialCookie || "";
		this.defaultHeaders = {
			"x-youtube-client-version": INNERTUBE_CLIENT_VERSION,
			"x-youtube-client-name": "1",
			"content-type": "application/json",
			"accept-encoding": "gzip, deflate, br",
		};
		this.defaultFetchOptions = options.fetchOptions || {};
		this.defaultClientOptions = options.youtubeClientOptions || {};
	}

	async get(url: string, options?: Partial<Options>): Promise<Response> {
		return await this.request(url, {
			...options,
			method: "GET",
		});
	}

	async post(url: string, options?: Partial<Options>): Promise<Response> {
		return await this.request(url, {
			...options,
			method: "POST",
			params: { key: INNERTUBE_API_KEY, ...options?.params },
			data: {
				context: {
					client: {
						clientName: "WEB",
						clientVersion: INNERTUBE_CLIENT_VERSION,
						...this.defaultClientOptions,
					},
				},
				...options?.data,
			},
		});
	}

	private async request(url: string, partialOptions: Partial<Options>): Promise<Response> {
		const options: RequestInit = {
			...partialOptions,
			...this.defaultFetchOptions,
			headers: {
				...this.defaultHeaders,
				cookie: this.cookie,
				...partialOptions.headers,
			},

			body: partialOptions.data ? JSON.stringify(partialOptions.data) : undefined,
		};

		const finalUrl = `https://${BASE_URL}/${url}?${new URLSearchParams(partialOptions.params)}`;

		const response = await fetch(finalUrl, options);
		const data = await response.json();
		this.parseCookie(response);

		return { data };
	}

	private parseCookie(response: FetchResponse) {
		const cookie = response.headers.get("set-cookie");
		if (cookie) this.cookie = cookie;
	}
}
