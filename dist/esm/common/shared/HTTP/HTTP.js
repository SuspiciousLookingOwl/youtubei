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
var __values = (this && this.__values) || function(o) {
    var s = typeof Symbol === "function" && Symbol.iterator, m = s && o[s], i = 0;
    if (m) return m.call(o);
    if (o && typeof o.length === "number") return {
        next: function () {
            if (o && i >= o.length) o = void 0;
            return { value: o && o[i++], done: !o };
        }
    };
    throw new TypeError(s ? "Object is not iterable." : "Symbol.iterator is not defined.");
};
var __read = (this && this.__read) || function (o, n) {
    var m = typeof Symbol === "function" && o[Symbol.iterator];
    if (!m) return o;
    var i = m.call(o), r, ar = [], e;
    try {
        while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
    }
    catch (error) { e = { error: error }; }
    finally {
        try {
            if (r && !r.done && (m = i["return"])) m.call(i);
        }
        finally { if (e) throw e.error; }
    }
    return ar;
};
import fetch from "node-fetch";
import { URLSearchParams } from "url";
/**
 * @hidden
 */
var HTTP = /** @class */ (function () {
    function HTTP(options) {
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
    HTTP.prototype.get = function (path, options) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.request(path, __assign(__assign({}, options), { params: __assign({ prettyPrint: "false" }, options === null || options === void 0 ? void 0 : options.params), method: "GET" }))];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    HTTP.prototype.post = function (path, options) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.request(path, __assign(__assign({}, options), { method: "POST", params: __assign({ key: this.apiKey, prettyPrint: "false" }, options === null || options === void 0 ? void 0 : options.params), data: __assign({ context: {
                                    client: __assign({ clientName: this.clientName, clientVersion: this.clientVersion }, this.defaultClientOptions),
                                } }, options === null || options === void 0 ? void 0 : options.data) }))];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    HTTP.prototype.request = function (path, partialOptions) {
        return __awaiter(this, void 0, void 0, function () {
            var options, urlString, url, _a, _b, _c, key, value, response, data;
            var e_1, _d;
            return __generator(this, function (_e) {
                switch (_e.label) {
                    case 0:
                        options = __assign(__assign(__assign({}, partialOptions), this.defaultFetchOptions), { headers: __assign(__assign(__assign(__assign({}, this.defaultHeaders), { cookie: this.cookie, referer: "https://" + this.baseUrl + "/" }), partialOptions.headers), this.defaultFetchOptions.headers), body: partialOptions.data ? JSON.stringify(partialOptions.data) : undefined });
                        if (path.startsWith("http")) {
                            url = new URL(path);
                            try {
                                for (_a = __values(Object.entries(partialOptions.params || {})), _b = _a.next(); !_b.done; _b = _a.next()) {
                                    _c = __read(_b.value, 2), key = _c[0], value = _c[1];
                                    url.searchParams.set(key, value);
                                }
                            }
                            catch (e_1_1) { e_1 = { error: e_1_1 }; }
                            finally {
                                try {
                                    if (_b && !_b.done && (_d = _a.return)) _d.call(_a);
                                }
                                finally { if (e_1) throw e_1.error; }
                            }
                            urlString = url.toString();
                        }
                        else {
                            urlString = "https://" + this.baseUrl + "/" + path + "?" + new URLSearchParams(partialOptions.params);
                        }
                        return [4 /*yield*/, fetch(urlString, options)];
                    case 1:
                        response = _e.sent();
                        return [4 /*yield*/, response.json()];
                    case 2:
                        data = _e.sent();
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
