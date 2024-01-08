import protobuf from "protobufjs";

import { MusicSearchType } from "../MusicSearchResult";
import { MusicSearchProto as ProtoType } from "./MusicSearchProto";

// TODO move this to .proto file
export const MusicSearchProto = protobuf
	.parse(
		`
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
`
	)
	.root.lookupType("MusicSearchOptions");

export const optionsToProto = (type: MusicSearchType): ProtoType["MusicSearchOptions"] => {
	return {
		params: {
			options: {
				song: type === "song" ? 1 : undefined,
				video: type === "video" ? 1 : undefined,
			},
		},
	};
};
