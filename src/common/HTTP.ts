/* eslint-disable @typescript-eslint/no-explicit-any */

import https from "https";
import { IncomingHttpHeaders } from "http";
import zlib from "zlib";
import qs from "querystring";
import { BASE_URL, INNERTUBE_API_KEY, INNERTUBE_CLIENT_VERSION } from "../constants";
import { YoutubeRawData } from "./types";
import { Client } from "../classes";

interface Options extends https.RequestOptions {
	params: Record<string, any>;
	data: any;
	headers: Record<string, string>;
}

interface Response<T = any> {
	data: T;
	headers: IncomingHttpHeaders;
	status: number | undefined;
}

export default class HTTP {
	private _cookie: string;
	private _hl: string;
	private _gl: string;
	private _localAddress: string;

	constructor(client: Client) {
		const { hl, cookie, gl, localAddress } = client.options;
		this._cookie = cookie;
		this._hl = hl;
		this._gl = gl;
		this._localAddress = localAddress;
	}

	/** Send GET request to Youtube */
	async get(path: string, options: Partial<Options>): Promise<YoutubeRawData> {
		options = {
			method: "GET",
			path,
			...options,
		};

		return await this.request(options);
	}

	/** Send POST request to Youtube */
	async post(path: string, options: Partial<Options>): Promise<YoutubeRawData> {
		options = {
			method: "POST",
			path,
			...options,
			params: { key: INNERTUBE_API_KEY, ...options.params },
			data: {
				context: {
					client: {
						clientName: "WEB",
						clientVersion: INNERTUBE_CLIENT_VERSION,
						hl: this._hl,
						gl: this._gl,
					},
				},
				...options.data,
			},
		};

		return await this.request(options);
	}

	/**
	 * Send request to Youtube
	 */
	private request(partialOptions: Partial<Options>): Promise<Response> {
		return new Promise((resolve, reject) => {
			const options = {
				hostname: BASE_URL,
				port: 443,
				localAddress: this._localAddress,
				...partialOptions,
				path: `${partialOptions.path}?${qs.stringify(partialOptions.params)}`,
				headers: {
					"x-youtube-client-version": INNERTUBE_CLIENT_VERSION,
					"x-youtube-client-name": "1",
					"content-type": "application/json",
					"accept-encoding": "gzip",
					cookie: this._cookie,
					...partialOptions.headers,
				},
			};

			let body = options.data || "";
			if (options.data) {
				if (options.headers["content-type"] === "application/x-www-form-urlencoded") {
					body = qs.stringify(body);
				} else if (options.headers["content-type"] === "application/json") {
					body = JSON.stringify(body);
				}
			}

			const request = https.request(options, (res) => {
				if (res.headers["set-cookie"]?.length)
					this._cookie = `${this._cookie} ${res.headers["set-cookie"]
						?.map((c) => c.split(";").shift())
						.join(";")}`;

				const gunzip = zlib.createGunzip();
				res.pipe(gunzip);
				const buffer: string[] = [];
				gunzip
					.on("data", (data) => {
						buffer.push(data.toString());
					})
					.on("end", () => {
						const data = JSON.parse(buffer.join("").toString());
						HTTP.returnPromise(
							{
								status: res.statusCode,
								headers: res.headers,
								data,
							},
							resolve,
							reject
						);
					})
					.on("error", reject);
			});

			request.on("error", reject);
			request.write(body);
			request.end();
		});
	}

	private static returnPromise(
		response: Response,
		resolve: (val: any) => void,
		reject: (reason: any) => void
	) {
		if (response.status === 500) reject(response.data);
		resolve(response);
	}
}
