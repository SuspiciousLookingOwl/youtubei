import { Channel, PlaylistCompact, VideoCompact } from "..";

export type SearchType = "video" | "channel" | "playlist" | "all";

export type SearchOptions = {
	type: SearchType;
};

export type SearchResultType<T> = T extends { type: "video" }
	? VideoCompact
	: T extends { type: "channel" }
	? Channel
	: T extends { type: "playlist" }
	? PlaylistCompact
	: VideoCompact | Channel | PlaylistCompact;
