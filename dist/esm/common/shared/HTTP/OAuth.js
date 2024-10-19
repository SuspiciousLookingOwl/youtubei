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
import { randomBytes } from "crypto";
import fetch from "node-fetch";
var OAuth = /** @class */ (function () {
    function OAuth() {
    }
    OAuth.authorize = function () {
        return __awaiter(this, void 0, void 0, function () {
            var body, response, data_1, authenticateResponse, err_1, message;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        body = {
                            client_id: this.CLIENT_ID,
                            scope: this.SCOPE,
                            device_id: randomBytes(20).toString("hex"),
                            device_model: "ytlr::",
                        };
                        return [4 /*yield*/, fetch("https://www.youtube.com/o/oauth2/device/code", {
                                method: "POST",
                                headers: {
                                    "Content-Type": "application/json",
                                    __youtube_oauth__: "True",
                                },
                                body: JSON.stringify(body),
                            })];
                    case 1:
                        response = _a.sent();
                        if (!response.ok) return [3 /*break*/, 12];
                        return [4 /*yield*/, response.json()];
                    case 2:
                        data_1 = _a.sent();
                        console.log("[youtubei] Open " + data_1.verification_url + " and enter " + data_1.user_code);
                        authenticateResponse = null;
                        _a.label = 3;
                    case 3:
                        if (!!authenticateResponse) return [3 /*break*/, 11];
                        _a.label = 4;
                    case 4:
                        _a.trys.push([4, 6, , 10]);
                        return [4 /*yield*/, this.authenticate(data_1.device_code)];
                    case 5:
                        authenticateResponse = _a.sent();
                        return [3 /*break*/, 10];
                    case 6:
                        err_1 = _a.sent();
                        message = err_1.message;
                        if (!(message === "authorization_pending")) return [3 /*break*/, 8];
                        return [4 /*yield*/, new Promise(function (r) { return setTimeout(r, data_1.interval * 1000); })];
                    case 7:
                        _a.sent();
                        return [3 /*break*/, 9];
                    case 8:
                        if (message === "expired_token") {
                            return [2 /*return*/, this.authorize()];
                        }
                        else {
                            throw err_1;
                        }
                        _a.label = 9;
                    case 9: return [3 /*break*/, 10];
                    case 10: return [3 /*break*/, 3];
                    case 11: return [2 /*return*/, authenticateResponse];
                    case 12: throw new Error("Authorization failed");
                }
            });
        });
    };
    OAuth.authenticate = function (code) {
        return __awaiter(this, void 0, void 0, function () {
            var body, response, data;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        body = {
                            client_id: this.CLIENT_ID,
                            client_secret: this.CLIENT_SECRET,
                            code: code,
                            grant_type: "http://oauth.net/grant_type/device/1.0",
                        };
                        return [4 /*yield*/, fetch("https://www.youtube.com/o/oauth2/token", {
                                method: "POST",
                                headers: {
                                    "Content-Type": "application/json",
                                    __youtube_oauth__: "True",
                                },
                                body: JSON.stringify(body),
                            })];
                    case 1:
                        response = _a.sent();
                        if (!response.ok) return [3 /*break*/, 3];
                        return [4 /*yield*/, response.json()];
                    case 2:
                        data = _a.sent();
                        if ("error" in data) {
                            throw new Error(data.error);
                        }
                        else {
                            return [2 /*return*/, {
                                    accessToken: data.access_token,
                                    expiresIn: data.expires_in,
                                    refreshToken: data.refresh_token,
                                    scope: data.scope,
                                    tokenType: data.token_type,
                                }];
                        }
                        return [3 /*break*/, 4];
                    case 3: throw new Error("Authentication failed");
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    OAuth.refreshToken = function (refreshToken) {
        return __awaiter(this, void 0, void 0, function () {
            var body, response, data;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        body = {
                            client_id: this.CLIENT_ID,
                            client_secret: this.CLIENT_SECRET,
                            refresh_token: refreshToken,
                            grant_type: "refresh_token",
                        };
                        return [4 /*yield*/, fetch("https://www.youtube.com/o/oauth2/token", {
                                method: "POST",
                                headers: {
                                    "Content-Type": "application/json",
                                    __youtube_oauth__: "True",
                                },
                                body: JSON.stringify(body),
                            })];
                    case 1:
                        response = _a.sent();
                        if (!response.ok) return [3 /*break*/, 3];
                        return [4 /*yield*/, response.json()];
                    case 2:
                        data = _a.sent();
                        if ("error" in data)
                            return [2 /*return*/, this.authorize()];
                        return [2 /*return*/, {
                                accessToken: data.access_token,
                                expiresIn: data.expires_in,
                                scope: data.scope,
                                tokenType: data.token_type,
                            }];
                    case 3: return [2 /*return*/, this.authorize()];
                }
            });
        });
    };
    OAuth.CLIENT_ID = "861556708454-d6dlm3lh05idd8npek18k6be8ba3oc68.apps.googleusercontent.com";
    OAuth.CLIENT_SECRET = "SboVhoG9s0rNafixCSGGKXAT";
    OAuth.SCOPE = "http://gdata.youtube.com https://www.googleapis.com/auth/youtube";
    return OAuth;
}());
export { OAuth };
