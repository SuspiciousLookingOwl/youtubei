import proto from "protocol-buffers";

import { SearchProto as ProtoType } from "./SearchProto";

// TODO move this to .proto file
export const SearchProto = proto<ProtoType>(`
	message SearchOptions {
		message VideoFilters {
			optional int32 uploadDate = 1;
			optional int32 type = 2;
			optional int32 duration = 3;
		}

		optional int32 sortBy = 1;
		optional VideoFilters videoFilters = 2;
	}
`);
