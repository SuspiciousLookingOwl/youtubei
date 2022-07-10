import { ChannelCompact, Reply, Thumbnails } from "..";
import { YoutubeRawData } from "../../common";

export class ReplyParser {
	static loadReply(target: Reply, data: YoutubeRawData): Reply {
		const {
			authorText,
			authorThumbnail,
			authorEndpoint,
			contentText,
			publishedTimeText,
			commentId,
			likeCount,
			authorIsChannelOwner,
		} = data;

		// Basic information
		target.id = commentId;
		target.content = contentText.runs.map((r: YoutubeRawData) => r.text).join("");
		target.publishDate = publishedTimeText.runs.shift().text;
		target.likeCount = likeCount;
		target.isAuthorChannelOwner = authorIsChannelOwner;

		// Author
		const { browseId } = authorEndpoint.browseEndpoint;
		target.author = new ChannelCompact({
			id: browseId,
			name: authorText.simpleText,
			thumbnails: new Thumbnails().load(authorThumbnail.thumbnails),
			client: target.client,
		});

		return target;
	}
}
