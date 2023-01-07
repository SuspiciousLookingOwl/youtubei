"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.optionsToProto = exports.SearchProto = void 0;
const protocol_buffers_1 = __importDefault(require("protocol-buffers"));
// TODO move this to .proto file
exports.SearchProto = protocol_buffers_1.default(`
	message SearchOptions {
		message Options {
			optional int32 uploadDate = 1;
			optional int32 type = 2;
			optional int32 duration = 3;
			optional int32 hd = 4;
			optional int32 subtitles = 5;
			optional int32 creativeCommons = 6;
			optional int32 live = 8;
			optional int32 4k = 14;
			optional int32 360 = 15;
			optional int32 location = 23;
			optional int32 hdr = 25;
			optional int32 vr180 = 26;
		}

		optional int32 sortBy = 1;
		optional Options options = 2;
	}
`);
const searchUploadDateProto = {
    all: 0,
    hour: 1,
    today: 2,
    week: 3,
    month: 4,
    year: 5,
};
const searchTypeProto = {
    all: 0,
    video: 1,
    channel: 2,
    playlist: 3,
};
const searchDurationProto = {
    all: 0,
    short: 1,
    long: 2,
    medium: 3,
};
const searchSortProto = {
    relevance: 0,
    rating: 1,
    date: 2,
    view: 3,
};
const optionsToProto = (options) => {
    var _a;
    const featuresRecord = ((_a = options.features) === null || _a === void 0 ? void 0 : _a.reduce((acc, val) => {
        if (val)
            acc[val] = 1;
        return acc;
    }, {})) || {};
    return {
        sortBy: options.sortBy && searchSortProto[options.sortBy],
        options: Object.assign({ duration: options.duration && searchDurationProto[options.duration], type: options.type && searchTypeProto[options.type], uploadDate: options.uploadDate && searchUploadDateProto[options.uploadDate] }, featuresRecord),
    };
};
exports.optionsToProto = optionsToProto;
