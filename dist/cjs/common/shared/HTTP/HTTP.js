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
exports.HTTP = void 0;
const node_fetch_1 = __importDefault(require("node-fetch"));
const url_1 = require("url");
const OAuth_1 = require("./OAuth");
/**
 * @hidden
 */
class HTTP {
    constructor(options) {
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
        this.oauth = Object.assign({ enabled: false, token: null, expiresAt: null }, options.oauth);
        this.authorizationPromise = null;
        this.defaultFetchOptions = options.fetchOptions || {};
        this.defaultClientOptions = options.youtubeClientOptions || {};
    }
    get(path, options) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.request(path, Object.assign(Object.assign({}, options), { params: Object.assign({ prettyPrint: "false" }, options === null || options === void 0 ? void 0 : options.params), method: "GET" }));
        });
    }
    post(path, options) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.request(path, Object.assign(Object.assign({}, options), { method: "POST", params: Object.assign({ key: this.apiKey, prettyPrint: "false" }, options === null || options === void 0 ? void 0 : options.params), data: Object.assign({ context: {
                        client: Object.assign({ clientName: this.clientName, clientVersion: this.clientVersion }, this.defaultClientOptions),
                    } }, options === null || options === void 0 ? void 0 : options.data) }));
        });
    }
    request(path, partialOptions) {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.authorizationPromise)
                yield this.authorizationPromise;
            const options = Object.assign(Object.assign(Object.assign({}, partialOptions), this.defaultFetchOptions), { headers: Object.assign(Object.assign(Object.assign(Object.assign({}, this.defaultHeaders), { cookie: this.cookie, referer: `https://${this.baseUrl}/` }), partialOptions.headers), this.defaultFetchOptions.headers), body: partialOptions.data ? JSON.stringify(partialOptions.data) : undefined });
            if (this.oauth.enabled) {
                this.authorizationPromise = this.authorize();
                yield this.authorizationPromise;
                if (this.oauth.token) {
                    options.headers = {
                        Authorization: `Bearer ${this.oauth.token}`,
                    };
                }
            }
            // if URL is a full URL, ignore baseUrl
            let urlString;
            if (path.startsWith("http")) {
                const url = new URL(path);
                for (const [key, value] of Object.entries(partialOptions.params || {})) {
                    url.searchParams.set(key, value);
                }
                urlString = url.toString();
            }
            else {
                urlString = `https://${this.baseUrl}/${path}?${new url_1.URLSearchParams(partialOptions.params)}`;
            }
            const response = yield node_fetch_1.default(urlString, options);
            const data = yield response.json();
            this.parseCookie(response);
            return { data };
        });
    }
    parseCookie(response) {
        const cookie = response.headers.get("set-cookie");
        if (cookie)
            this.cookie = cookie;
    }
    authorize() {
        return __awaiter(this, void 0, void 0, function* () {
            const isExpired = !this.oauth.expiresAt || this.oauth.expiresAt.getTime() - 5 * 60 * 1000 < Date.now();
            if (this.oauth.refreshToken && (isExpired || !this.oauth.token)) {
                const response = yield OAuth_1.OAuth.refreshToken(this.oauth.refreshToken);
                this.oauth.token = response.accessToken;
                this.oauth.expiresAt = new Date(Date.now() + response.expiresIn * 1000);
            }
            else if (isExpired || !this.oauth.token) {
                const response = yield OAuth_1.OAuth.authorize();
                this.oauth.token = response.accessToken;
                this.oauth.refreshToken = response.refreshToken;
                this.oauth.expiresAt = new Date(Date.now() + response.expiresIn * 1000);
            }
        });
    }
}
exports.HTTP = HTTP;
