import { YoutubeRawData } from "../../common";
import { BaseChannel } from "../BaseChannel";
import { Post } from "./Post";

export class PostParser {
	static loadPost(target: Post, data: YoutubeRawData): Post {
		const {
			postId,
			authorText,
			authorThumbnail,
			authorEndpoint,
			contentText,
			publishedTimeText,
			voteCount,
		} = data;

		// Basic information
		target.id = postId;
		target.content = contentText?.runs?.map((r: YoutubeRawData) => r.text).join("");
		target.channel = new BaseChannel({
			id: authorEndpoint?.browseEndpoint?.browseId,
			name: (authorText as YoutubeRawData).runs?.[0].text,
			thumbnails: authorThumbnail.thumbnails,
			client: target.client,
		});
		target.timestamp = (publishedTimeText as YoutubeRawData).runs[0]?.text;
		target.voteCount = voteCount.simpleText;

		return target;
	}
}
