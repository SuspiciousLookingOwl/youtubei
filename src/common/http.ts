import https from "https";
import zlib from "zlib";
import qs, { ParsedUrlQueryInput } from "querystring";
import { BASE_URL, INNERTUBE_API_KEY, INNERTUBE_CLIENT_VERSION } from "../constants";
import { YoutubeRawData } from "./types";

class HTTP {
	/**
	 * Send request to Youtube
	 */
	static request(
		options: https.RequestOptions,
		params: ParsedUrlQueryInput,
		data?: Record<string, unknown>
	): Promise<YoutubeRawData> {
		return new Promise((resolve, reject) => {
			options = {
				hostname: BASE_URL,
				port: 443,
				...options,
				path: `${options.path}?${qs.stringify(params)}`,
				headers: {
					"Content-Type": "application/json",
					"Accept-Encoding": "gzip, deflate, br",
					...options.headers,
				},
			};

			const request = https.request(options, (res) => {
				const gunzip = zlib.createGunzip();
				res.pipe(gunzip);
				const buffer: string[] = [];
				gunzip
					.on("data", (data) => {
						buffer.push(data.toString());
					})
					.on("end", () => {
						resolve(JSON.parse(buffer.join("").toString()));
					});
			});

			request.on("error", reject);
			request.write(data ? JSON.stringify(data) : "");
			request.end();
		});
	}

	/**
	 * Send GET request to Youtube
	 */
	static async get(path: string, params: ParsedUrlQueryInput): Promise<YoutubeRawData> {
		const options: https.RequestOptions = {
			method: "GET",
			path,
			headers: {
				"x-youtube-client-version": INNERTUBE_CLIENT_VERSION,
				"x-youtube-client-name": 1,
			},
		};

		return await HTTP.request(options, params);
	}

	/**
	 * Send POST request to Youtube
	 */
	static async post(path: string, data: Record<string, unknown>): Promise<YoutubeRawData> {
		const options: https.RequestOptions = {
			method: "POST",
			path,
		};
		data = {
			context: {
				client: {
					clientName: "WEB",
					clientVersion: INNERTUBE_CLIENT_VERSION,
				},
			},
			...data,
		};

		return await HTTP.request(options, { key: INNERTUBE_API_KEY }, data);
	}
}

export default HTTP;
