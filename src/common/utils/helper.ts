import { Thumbnail } from "../shared";
import { YoutubeRawData } from "./types";

export const getDuration = (s: string): number => {
	s = s.replace(/:/g, ".");
	const spl = s.split(".");
	if (spl.length === 0) return +spl;
	else {
		const sumStr = spl.pop() as string;
		let sum = +sumStr;
		if (spl.length === 1) sum += +spl[0] * 60;
		if (spl.length === 2) {
			sum += +spl[1] * 60;
			sum += +spl[0] * 3600;
		}
		return sum;
	}
};

export const stripToInt = (string: string): number | null => {
	if (!string) return null;
	return +string.replace(/[^0-9]/g, "");
};

// parses abbreviated counts such as "40K" or "1.2M"
export const stripToIntCompact = (string: string): number | null => {
	if (!string) return null;
	const match = string.match(/([\d.,]+)\s*([KMB])?/i);
	if (!match) return null;
	const value = +match[1].replace(/,/g, "");
	if (isNaN(value)) return null;
	const multiplier: Record<string, number> = { k: 1e3, m: 1e6, b: 1e9 };
	return Math.round(value * (multiplier[match[2]?.toLowerCase()] || 1));
};

export const getContinuationFromItems = (
	items: YoutubeRawData,
	accessors: string[] = ["continuationEndpoint"]
): string | undefined => {
	const continuation = items[items.length - 1];

	if (continuation?.continuationItemRenderer) {
		let current = continuation.continuationItemRenderer;
		for (const accessor of accessors) {
			current = current[accessor];
		}

		if (current?.commandExecutorCommand?.commands?.length) {
			current = current.commandExecutorCommand.commands.find(
				(cmd: YoutubeRawData) => "continuationCommand" in cmd
			);
		}

		return current?.continuationCommand?.token;
	} else if (continuation?.continuationItemViewModel) {
		return continuation.continuationItemViewModel.continuationCommand.innertubeCommand
			.continuationCommand.token;
	} else {
		return;
	}
};

export const mapFilter = (items: YoutubeRawData, key: string): YoutubeRawData => {
	return items
		.filter((item: YoutubeRawData) => item[key])
		.map((item: YoutubeRawData) => item[key]);
};

export const getThumbnailFromId = (id: string): Thumbnail[] => {
	return [
		{
			url: `https://i.ytimg.com/vi/${id}/default.jpg`,
			width: 120,
			height: 90,
		},
		{
			url: `https://i.ytimg.com/vi/${id}/mqdefault.jpg`,
			width: 320,
			height: 180,
		},
		{
			url: `https://i.ytimg.com/vi/${id}/hqdefault.jpg`,
			width: 480,
			height: 360,
		},
	];
};
