/* eslint-disable @typescript-eslint/no-explicit-any */

import https from "https";
import { IncomingHttpHeaders } from "http";
import zlib from "zlib";
import qs from "querystring";
import { BASE_URL, INNERTUBE_API_KEY, INNERTUBE_CLIENT_VERSION } from "../constants";
import { YoutubeRawData } from "./types";

interface Options extends https.RequestOptions {
	params?: Record<string, any>;
	data?: any;
	headers?: Record<string, string>;
}

interface Response<T = any> {
	data: T;
	headers: IncomingHttpHeaders;
	status: number | undefined;
}

class HTTP {
	/**
	 * Send request to Youtube
	 */
	static request(options: Options): Promise<Response> {
		return new Promise((resolve, reject) => {
			options = {
				hostname: BASE_URL,
				port: 443,
				...options,
				path: `${options.path}?${qs.stringify(options.params)}`,
				headers: {
					"x-youtube-client-version": INNERTUBE_CLIENT_VERSION,
					"x-youtube-client-name": "1",
					"Content-Type": "application/json",
					"Accept-Encoding": "gzip",
					...options.headers,
				},
			};

			const request = https.request(options, (res) => {
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
							resolve({
								status: res.statusCode,
								headers: res.headers,
								data,
							});
						})
						.on("error", reject);
				} else {
					let body = "";
					res.on("data", (data) => {
						body += data;
					})
						.on("end", () => {
							const data = JSON.parse(body);
							resolve({
								status: res.statusCode,
								headers: res.headers,
								data,
							});
						})
						.on("error", reject);
				}
			});

			request.on("error", reject);
			request.write(options.data ? JSON.stringify(options.data) : "");
			request.end();
		});
	}

	/**
	 * Send GET request to Youtube
	 */
	static async get(path: string, options: Options): Promise<YoutubeRawData> {
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
	static async post(path: string, options: Options): Promise<YoutubeRawData> {
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

export default HTTP;
