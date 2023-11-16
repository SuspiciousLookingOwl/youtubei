import protobuf from "protobufjs";

export type TranscriptParams = {
	TranscriptParams: {
		videoId: string;
	};
};

export const TranscriptParamsProto = protobuf.parse(`
	message TranscriptParams {
		optional string videoId = 1;
	}
`).root.lookupType("TranscriptParams");
