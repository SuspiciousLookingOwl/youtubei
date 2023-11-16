"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TranscriptParamsProto = void 0;
const protobufjs_1 = __importDefault(require("protobufjs"));
exports.TranscriptParamsProto = protobufjs_1.default.parse(`
	message TranscriptParams {
		optional string videoId = 1;
	}
`).root.lookupType("TranscriptParams");
