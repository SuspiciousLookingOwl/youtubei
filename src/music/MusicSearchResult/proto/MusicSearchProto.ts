type Options = {
	song?: 1;
	video?: 1;
};

type MusicSearchOptions = {
	options?: Options;
};

type MusicSearchParams = {
	params?: MusicSearchOptions;
};

export type MusicSearchProto = {
	MusicSearchOptions: MusicSearchParams;
};
