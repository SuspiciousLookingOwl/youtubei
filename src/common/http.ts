/* eslint-disable @typescript-eslint/no-explicit-any */

import https from "https";
import { IncomingHttpHeaders } from "http";
import zlib from "zlib";
import qs from "querystring";
import { BASE_URL, INNERTUBE_API_KEY, INNERTUBE_CLIENT_VERSION } from "../constants";
import { YoutubeRawData } from "./types";

let cookie = "";

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
	/**
	 * Send request to Youtube
	 */
	static request(partialOptions: Partial<Options>): Promise<Response> {
		return new Promise((resolve, reject) => {
			const options = {
				hostname: BASE_URL,
				port: 443,
				...partialOptions,
				path: `${partialOptions.path}?${qs.stringify(partialOptions.params)}`,
				headers: {
					"x-youtube-client-version": INNERTUBE_CLIENT_VERSION,
					"x-youtube-client-name": "1",
					"content-type": "application/json",
					"accept-encoding": "gzip",
					cookie,
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
				cookie = res.headers["set-cookie"]?.join(";") || cookie;
				if (res.headers["content-encoding"] === "gzip") {
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
				} else {
					let body = "";
					res.on("data", (data) => {
						body += data;
					})
						.on("end", () => {
							const data = JSON.parse(body);
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
				}
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

	/**
	 * Send GET request to Youtube
	 */
	static async get(path: string, options: Partial<Options>): Promise<YoutubeRawData> {
		options = {
			method: "GET",
			path,
			...options,
		};

		return await HTTP.request(options);
	}

	/**
	 * Send POST request to Youtube
	 */
	static async post(path: string, options: Partial<Options>): Promise<YoutubeRawData> {
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
					},
				},
				...options.data,
			},
		};

		return await HTTP.request(options);
	}
}
