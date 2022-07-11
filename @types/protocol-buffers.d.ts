declare module "protocol-buffers" {
	type Message<T> = {
		encode: (obj: T) => Buffer;
		decode: (buf: Buffer) => T;
	};

	type Proto = <T, X = keyof T>(obj: Buffer | string) => { [Y in X]: Message<T[Y]> };

	const proto: Proto;
	export default proto;
}
