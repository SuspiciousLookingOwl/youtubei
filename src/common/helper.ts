import { URL } from "url";
import { YoutubeRawData } from "./types";

export const getDuration = (s: string): number => {
	s = s.replace(/:/g, ".");
	const spl = s.split(".");
	if (spl.length === 0) return +spl;
	else {
		const sumStr = spl.pop();
		if (sumStr !== undefined) {
			let sum = +sumStr;
			if (spl.length === 1) sum += +spl[0] * 60;
			if (spl.length === 2) {
				sum += +spl[1] * 60;
				sum += +spl[0] * 3600;
			}
			return sum;
		} else {
			return 0;
		}
	}
};

export const getQueryParameter = (url: string, queryName: string): string => {
	try {
		return new URL(url).searchParams.get(queryName) || url;
	} catch (err) {
		/* not an URL */
		return url;
	}
};

export const stripToInt = (string: string): number | null => {
	if (!string) return null;
	return +string.replace(/[^0-9]/g, "");
};

export const getContinuationFromContents = (data: YoutubeRawData[]): string | undefined => {
	const lastSecondaryContent = data[data.length - 1];
	return "continuationItemRenderer" in lastSecondaryContent
		? lastSecondaryContent.continuationItemRenderer.continuationEndpoint.continuationCommand
				.token
		: undefined;
};
