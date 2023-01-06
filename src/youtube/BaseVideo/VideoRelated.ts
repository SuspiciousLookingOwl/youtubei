import { Client } from "../Client";
import { Continuable, FetchResult } from "../Continuable";
import { PlaylistCompact } from "../PlaylistCompact";
import { VideoCompact } from "../VideoCompact";
import { I_END_POINT } from "../constants";
import { BaseVideo } from "./BaseVideo";
import { BaseVideoParser } from "./BaseVideoParser";

/** @hidden */
interface ConstructorParams {
	client: Client;
	video?: BaseVideo;
}

/**
 * {@link Continuable} of related videos inside a Video
 */
export class VideoRelated extends Continuable<VideoCompact | PlaylistCompact> {
	/** The video this list of related videos belongs to */
	video?: BaseVideo;

	/** @hidden */
	constructor({ video, client }: ConstructorParams) {
		super({ client });
		this.video = video;
	}

	protected async fetch(): Promise<FetchResult<VideoCompact | PlaylistCompact>> {
		const response = await this.client.http.post(`${I_END_POINT}/next`, {
			data: { continuation: this.continuation },
		});

		const items = BaseVideoParser.parseRelated(response.data, this.client);
		const continuation = BaseVideoParser.parseContinuation(response.data);

		return {
			continuation,
			items,
		};
	}
}
