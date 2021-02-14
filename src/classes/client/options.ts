import { Channel, PlaylistCompact, VideoCompact } from "..";

export type SearchOptions = {
	type: "video" | "channel" | "playlist" | "all";
	limit: number;
};

export type SearchType<T> = T extends { type: "video" }
	? VideoCompact
	: T extends { type: "channel" }
	? Channel
	: T extends { type: "playlist" }
	? PlaylistCompact
	: VideoCompact | Channel | PlaylistCompact;

export type GetPlaylistOptions = {
	continuationLimit: number;
};
