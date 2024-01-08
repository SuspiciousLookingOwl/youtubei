declare type Options = {
    song?: 1;
    video?: 1;
};
declare type MusicSearchOptions = {
    options?: Options;
};
declare type MusicSearchParams = {
    params?: MusicSearchOptions;
};
export declare type MusicSearchProto = {
    MusicSearchOptions: MusicSearchParams;
};
export {};
