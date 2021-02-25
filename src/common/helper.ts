import { URL } from "url";

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
