import { randomBytes } from "crypto";
import fetch from "node-fetch";

interface ErrorResponse {
	error: string;
	error_description: string;
}

interface AuthorizeRawResponse {
	device_code: string;
	user_code: string;
	expires_in: number;
	interval: number;
	verification_url: string;
}

interface RefreshRawResponse {
	access_token: string;
	expires_in: number;
	scope: string;
	token_type: string;
}

export interface RefreshResponse {
	accessToken: string;
	expiresIn: number;
	scope: string;
	tokenType: string;
}

interface AuthenticateRawResponse {
	access_token: string;
	expires_in: number;
	refresh_token: string;
	scope: string;
	token_type: string;
}

export interface AuthenticateResponse {
	accessToken: string;
	expiresIn: number;
	refreshToken: string;
	scope: string;
	tokenType: string;
}

export class OAuth {
	private static CLIENT_ID =
		"861556708454-d6dlm3lh05idd8npek18k6be8ba3oc68.apps.googleusercontent.com";
	private static CLIENT_SECRET = "SboVhoG9s0rNafixCSGGKXAT";
	private static SCOPE = "http://gdata.youtube.com https://www.googleapis.com/auth/youtube";

	static async authorize(): Promise<AuthenticateResponse> {
		const body = {
			client_id: this.CLIENT_ID,
			scope: this.SCOPE,
			device_id: randomBytes(20).toString("hex"),
			device_model: "ytlr::",
		};

		const response = await fetch("https://www.youtube.com/o/oauth2/device/code", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
				__youtube_oauth__: "True",
			},
			body: JSON.stringify(body),
		});

		if (response.ok) {
			const data: AuthorizeRawResponse = await response.json();

			console.log(`[youtubei] Open ${data.verification_url} and enter ${data.user_code}`);

			let authenticateResponse: AuthenticateResponse | null = null;

			while (!authenticateResponse) {
				try {
					authenticateResponse = await this.authenticate(data.device_code);
				} catch (err) {
					const message = (err as Error).message;
					if (message === "authorization_pending") {
						await new Promise((r) => setTimeout(r, data.interval * 1000));
					} else if (message === "expired_token") {
						return this.authorize();
					} else {
						throw err;
					}
				}
			}

			return authenticateResponse;
		}

		throw new Error("Authorization failed");
	}

	private static async authenticate(code: string): Promise<AuthenticateResponse> {
		const body = {
			client_id: this.CLIENT_ID,
			client_secret: this.CLIENT_SECRET,
			code,
			grant_type: "http://oauth.net/grant_type/device/1.0",
		};

		const response = await fetch("https://www.youtube.com/o/oauth2/token", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
				__youtube_oauth__: "True",
			},
			body: JSON.stringify(body),
		});

		if (response.ok) {
			const data: AuthenticateRawResponse | ErrorResponse = await response.json();

			if ("error" in data) {
				throw new Error(data.error);
			} else {
				return {
					accessToken: data.access_token,
					expiresIn: data.expires_in,
					refreshToken: data.refresh_token,
					scope: data.scope,
					tokenType: data.token_type,
				};
			}
		} else {
			throw new Error("Authentication failed");
		}
	}

	static async refreshToken(refreshToken: string): Promise<RefreshResponse> {
		const body = {
			client_id: this.CLIENT_ID,
			client_secret: this.CLIENT_SECRET,
			refresh_token: refreshToken,
			grant_type: "refresh_token",
		};

		const response = await fetch("https://www.youtube.com/o/oauth2/token", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
				__youtube_oauth__: "True",
			},
			body: JSON.stringify(body),
		});

		if (response.ok) {
			const data: RefreshRawResponse | ErrorResponse = await response.json();
			if ("error" in data) return this.authorize();
			return {
				accessToken: data.access_token,
				expiresIn: data.expires_in,
				scope: data.scope,
				tokenType: data.token_type,
			};
		} else {
			return this.authorize();
		}
	}
}
