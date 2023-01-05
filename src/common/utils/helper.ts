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

export const getContinuationFromItems = (
	items: YoutubeRawData,
	accessors: string[] = ["continuationEndpoint"]
): string | undefined => {
	const continuation = items[items.length - 1];
	const renderer = continuation?.continuationItemRenderer;
	if (!renderer) return;

	let current = renderer;
	for (const accessor of accessors) {
		current = current[accessor];
	}

	return current.continuationCommand.token;
};

export const mapFilter = (items: YoutubeRawData, key: string): YoutubeRawData => {
	return items
		.filter((item: YoutubeRawData) => item[key])
		.map((item: YoutubeRawData) => item[key]);
};
