/// <reference types="node" />
import { SearchOptions } from "../SearchResult";
import { SearchProto as ProtoType } from "./SearchProto";
export declare const SearchProto: {
    SearchOptions: {
        encode: (obj: {
            sortBy?: number | undefined;
            options?: {
                uploadDate?: number | undefined;
                type?: number | undefined;
                duration?: number | undefined;
                live?: number | undefined;
                "4k"?: number | undefined;
                hd?: number | undefined;
                subtitles?: number | undefined;
                creativeCommons?: number | undefined;
                "360"?: number | undefined;
                vr180?: number | undefined;
                "3d"?: number | undefined;
                hdr?: number | undefined;
                location?: number | undefined;
            } | undefined;
        }) => Buffer;
        decode: (buf: Buffer) => {
            sortBy?: number | undefined;
            options?: {
                uploadDate?: number | undefined;
                type?: number | undefined;
                duration?: number | undefined;
                live?: number | undefined;
                "4k"?: number | undefined;
                hd?: number | undefined;
                subtitles?: number | undefined;
                creativeCommons?: number | undefined;
                "360"?: number | undefined;
                vr180?: number | undefined;
                "3d"?: number | undefined;
                hdr?: number | undefined;
                location?: number | undefined;
            } | undefined;
        };
    };
};
export declare const optionsToProto: (options: SearchOptions) => ProtoType["SearchOptions"];
