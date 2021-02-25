/* eslint-disable @typescript-eslint/no-explicit-any */
interface Constructor<T> {
	new (...args: any[]): T;
}

export function extendsBuiltIn(): (target: Constructor<any>) => any {
	return (target: Constructor<any>) => {
		return class extends target {
			constructor(...args: any[]) {
				super(args);
				Object.setPrototypeOf(this, target.prototype);
			}
		};
	};
}
