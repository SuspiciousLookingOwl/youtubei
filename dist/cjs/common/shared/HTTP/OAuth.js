"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.OAuth = void 0;
const crypto_1 = require("crypto");
const node_fetch_1 = __importDefault(require("node-fetch"));
class OAuth {
    static authorize() {
        return __awaiter(this, void 0, void 0, function* () {
            const body = {
                client_id: this.CLIENT_ID,
                scope: this.SCOPE,
                device_id: crypto_1.randomBytes(20).toString("hex"),
                device_model: "ytlr::",
            };
            const response = yield node_fetch_1.default("https://www.youtube.com/o/oauth2/device/code", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    __youtube_oauth__: "True",
                },
                body: JSON.stringify(body),
            });
            if (response.ok) {
                const data = yield response.json();
                console.log(`[youtubei] Open ${data.verification_url} and enter ${data.user_code}`);
                let authenticateResponse = null;
                while (!authenticateResponse) {
                    try {
                        authenticateResponse = yield this.authenticate(data.device_code);
                    }
                    catch (err) {
                        const message = err.message;
                        if (message === "authorization_pending") {
                            yield new Promise((r) => setTimeout(r, data.interval * 1000));
                        }
                        else if (message === "expired_token") {
                            return this.authorize();
                        }
                        else {
                            throw err;
                        }
                    }
                }
                return authenticateResponse;
            }
            throw new Error("Authorization failed");
        });
    }
    static authenticate(code) {
        return __awaiter(this, void 0, void 0, function* () {
            const body = {
                client_id: this.CLIENT_ID,
                client_secret: this.CLIENT_SECRET,
                code,
                grant_type: "http://oauth.net/grant_type/device/1.0",
            };
            const response = yield node_fetch_1.default("https://www.youtube.com/o/oauth2/token", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    __youtube_oauth__: "True",
                },
                body: JSON.stringify(body),
            });
            if (response.ok) {
                const data = yield response.json();
                if ("error" in data) {
                    throw new Error(data.error);
                }
                else {
                    return {
                        accessToken: data.access_token,
                        expiresIn: data.expires_in,
                        refreshToken: data.refresh_token,
                        scope: data.scope,
                        tokenType: data.token_type,
                    };
                }
            }
            else {
                throw new Error("Authentication failed");
            }
        });
    }
    static refreshToken(refreshToken) {
        return __awaiter(this, void 0, void 0, function* () {
            const body = {
                client_id: this.CLIENT_ID,
                client_secret: this.CLIENT_SECRET,
                refresh_token: refreshToken,
                grant_type: "refresh_token",
            };
            const response = yield node_fetch_1.default("https://www.youtube.com/o/oauth2/token", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    __youtube_oauth__: "True",
                },
                body: JSON.stringify(body),
            });
            if (response.ok) {
                const data = yield response.json();
                if ("error" in data)
                    return this.authorize();
                return {
                    accessToken: data.access_token,
                    expiresIn: data.expires_in,
                    scope: data.scope,
                    tokenType: data.token_type,
                };
            }
            else {
                return this.authorize();
            }
        });
    }
}
exports.OAuth = OAuth;
OAuth.CLIENT_ID = "861556708454-d6dlm3lh05idd8npek18k6be8ba3oc68.apps.googleusercontent.com";
OAuth.CLIENT_SECRET = "SboVhoG9s0rNafixCSGGKXAT";
OAuth.SCOPE = "http://gdata.youtube.com https://www.googleapis.com/auth/youtube";
