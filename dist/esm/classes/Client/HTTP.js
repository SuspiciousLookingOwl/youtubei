var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
import fetch from "node-fetch";
import { URLSearchParams } from "url";
import { BASE_URL, INNERTUBE_API_KEY, INNERTUBE_CLIENT_VERSION } from "../../constants";
var HTTP = /** @class */ (function () {
    function HTTP(options) {
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
    HTTP.prototype.get = function (url, options) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.request(url, __assign(__assign({}, options), { params: __assign({ prettyPrint: "false" }, options === null || options === void 0 ? void 0 : options.params), method: "GET" }))];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    HTTP.prototype.post = function (url, options) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.request(url, __assign(__assign({}, options), { method: "POST", params: __assign({ key: INNERTUBE_API_KEY, prettyPrint: "false" }, options === null || options === void 0 ? void 0 : options.params), data: __assign({ context: {
                                    client: __assign({ clientName: "WEB", clientVersion: INNERTUBE_CLIENT_VERSION }, this.defaultClientOptions),
                                } }, options === null || options === void 0 ? void 0 : options.data) }))];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    HTTP.prototype.request = function (url, partialOptions) {
        return __awaiter(this, void 0, void 0, function () {
            var options, finalUrl, response, data;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        options = __assign(__assign(__assign({}, partialOptions), this.defaultFetchOptions), { headers: __assign(__assign(__assign(__assign({}, this.defaultHeaders), { cookie: this.cookie }), partialOptions.headers), this.defaultFetchOptions.headers), body: partialOptions.data ? JSON.stringify(partialOptions.data) : undefined });
                        finalUrl = "https://" + BASE_URL + "/" + url + "?" + new URLSearchParams(partialOptions.params);
                        return [4 /*yield*/, fetch(finalUrl, options)];
                    case 1:
                        response = _a.sent();
                        return [4 /*yield*/, response.json()];
                    case 2:
                        data = _a.sent();
                        this.parseCookie(response);
                        return [2 /*return*/, { data: data }];
                }
            });
        });
    };
    HTTP.prototype.parseCookie = function (response) {
        var cookie = response.headers.get("set-cookie");
        if (cookie)
            this.cookie = cookie;
    };
    return HTTP;
}());
export { HTTP };
