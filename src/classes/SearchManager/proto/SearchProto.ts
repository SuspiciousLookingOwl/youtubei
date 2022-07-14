type Options = {
	uploadDate?: number;
	type?: number;
	duration?: number;
};

type SearchOptions = {
	sortBy?: number;
	options?: Options;
};

export type SearchProto = {
	SearchOptions: SearchOptions;
};
