"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.optionsToProto = exports.MusicSearchProto = void 0;
const protobufjs_1 = __importDefault(require("protobufjs"));
// TODO move this to .proto file
exports.MusicSearchProto = protobufjs_1.default
    .parse(`
	message MusicSearchOptions {
		message Options {
			optional int32 song = 1;
			optional int32 video = 2;
		}

		message Params {
			optional Options options = 17;
		}

		optional Params params = 2;
	}
`)
    .root.lookupType("MusicSearchOptions");
const optionsToProto = (type) => {
    return {
        params: {
            options: {
                song: type === "song" ? 1 : undefined,
                video: type === "video" ? 1 : undefined,
            },
        },
    };
};
exports.optionsToProto = optionsToProto;
