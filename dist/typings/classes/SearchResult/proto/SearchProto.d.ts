declare type Options = {
    uploadDate?: number;
    type?: number;
    duration?: number;
    live?: number;
    "4k"?: number;
    hd?: number;
    subtitles?: number;
    creativeCommons?: number;
    "360"?: number;
    vr180?: number;
    "3d"?: number;
    hdr?: number;
    location?: number;
};
declare type SearchOptions = {
    sortBy?: number;
    options?: Options;
};
export declare type SearchProto = {
    SearchOptions: SearchOptions;
};
export {};
