"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TranscriptParamsProto = void 0;
const protocol_buffers_1 = __importDefault(require("protocol-buffers"));
exports.TranscriptParamsProto = protocol_buffers_1.default(`
	message TranscriptParams {
		optional string videoId = 1;
	}
`);
