type VideoFilters = {
	uploadDate?: number;
	type?: number;
	duration?: number;
};

type SearchOptions = {
	sortBy?: number;
	videoFilters?: VideoFilters;
};

export type SearchProto = {
	SearchOptions: SearchOptions;
};
