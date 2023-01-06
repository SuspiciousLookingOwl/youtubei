import { YoutubeRawData } from "../../common";
import { BaseChannel } from "../BaseChannel";
import { Chat } from "./Chat";

export class ChatParser {
	static loadChat(target: Chat, data: YoutubeRawData): Chat {
		const {
			id,
			message,
			authorName,
			authorPhoto,
			timestampUsec,
			authorExternalChannelId,
		} = data;

		// Basic information
		target.id = id;
		target.message = message.runs.map((r: YoutubeRawData) => r.text).join("");
		target.author = new BaseChannel({
			id: authorExternalChannelId,
			name: authorName.simpleText,
			thumbnails: authorPhoto.thumbnails,
			client: target.client,
		});
		target.timestamp = +timestampUsec;

		return target;
	}
}
