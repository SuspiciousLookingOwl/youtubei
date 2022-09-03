import { Client } from "../Client";
import { Continuable, FetchResult } from "../Continuable";
import { PlaylistCompact } from "../PlaylistCompact";
import { VideoCompact } from "../VideoCompact";
import { BaseVideo } from "./BaseVideo";
/** @hidden */
interface ConstructorParams {
    client: Client;
    video?: BaseVideo;
}
/**
 * {@link Continuable} of related videos inside a Video
 */
export declare class VideoRelated extends Continuable<VideoCompact | PlaylistCompact> {
    /** The video this list of related videos belongs to */
    video?: BaseVideo;
    /** @hidden */
    constructor({ video, client }: ConstructorParams);
    protected fetch(): Promise<FetchResult<VideoCompact | PlaylistCompact>>;
}
export {};
