import proto from "protocol-buffers";

export type TranscriptParams = {
	TranscriptParams: {
		videoId: string;
	};
};

export const TranscriptParamsProto = proto<TranscriptParams>(`
	message TranscriptParams {
		optional string videoId = 1;
	}
`);
