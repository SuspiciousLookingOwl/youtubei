import protobuf from "protobufjs";

import {
	SearchDuration,
	SearchFeature,
	SearchOptions,
	SearchSort,
	SearchType,
	SearchUploadDate,
} from "../SearchResult";
import { SearchProto as ProtoType } from "./SearchProto";

// TODO move this to .proto file
export const SearchProto = protobuf.parse(`
	message SearchOptions {
		message Options {
			optional int32 uploadDate = 1;
			optional int32 type = 2;
			optional int32 duration = 3;
			optional int32 hd = 4;
			optional int32 subtitles = 5;
			optional int32 creativeCommons = 6;
			optional int32 live = 8;
			optional int32 _4k = 14;
			optional int32 _360 = 15;
			optional int32 location = 23;
			optional int32 hdr = 25;
			optional int32 vr180 = 26;
		}

		optional int32 sortBy = 1;
		optional Options options = 2;
	}
`).root.lookupType("SearchOptions");

const searchUploadDateProto: Record<SearchUploadDate, number> = {
	all: 0,
	hour: 1,
	today: 2,
	week: 3,
	month: 4,
	year: 5,
};

const searchTypeProto: Record<SearchType, number> = {
	all: 0,
	video: 1,
	channel: 2,
	playlist: 3,
};

const searchDurationProto: Record<SearchDuration, number> = {
	all: 0,
	short: 1,
	long: 2,
	medium: 3,
};

const searchSortProto: Record<SearchSort, number> = {
	relevance: 0,
	rating: 1,
	date: 2,
	view: 3,
};

export const optionsToProto = (options: SearchOptions): ProtoType["SearchOptions"] => {
	const featuresRecord =
		options.features?.reduce((acc, val) => {
			if (val) acc[val] = 1;
			return acc;
		}, {} as Record<SearchFeature, number>) || {};

	return {
		sortBy: options.sortBy && searchSortProto[options.sortBy],
		options: {
			duration: options.duration && searchDurationProto[options.duration],
			type: options.type && searchTypeProto[options.type],
			uploadDate: options.uploadDate && searchUploadDateProto[options.uploadDate],
			...featuresRecord,
		},
	};
};
