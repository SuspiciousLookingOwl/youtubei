// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types, @typescript-eslint/no-explicit-any
export const applyMixins = (derivedCtor: any, baseCtors: any[]) => {
	baseCtors.forEach((baseCtor) => {
		Object.getOwnPropertyNames(baseCtor.prototype).forEach((name) => {
			if (name !== "constructor") {
				derivedCtor.prototype[name] = baseCtor.prototype[name];
			}
		});
	});
};
