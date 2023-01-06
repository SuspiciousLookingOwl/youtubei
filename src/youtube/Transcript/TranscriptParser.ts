import { YoutubeRawData } from "../../common";
import { Transcript } from "./Transcript";

export class TranscriptParser {
	static loadTranscript(target: Transcript, data: YoutubeRawData): Transcript {
		const { cue, startOffsetMs, durationMs } = data;

		target.text = cue.simpleText;
		target.duration = +durationMs;
		target.start = +startOffsetMs;

		return target;
	}
}
