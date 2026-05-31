import "jest-extended";

import { parseNumberRepresentation } from "../../../src/common/utils/helper";

describe("parseNumberRepresentation", () => {
	it("should convert shorthand numbers", () => {
		expect(parseNumberRepresentation("100K views")).toBe(100000);
		expect(parseNumberRepresentation("2.3k views")).toBe(2300);
		expect(parseNumberRepresentation("1.2m views")).toBe(1200000);
		expect(parseNumberRepresentation("1B views")).toBe(1000000000);
		expect(parseNumberRepresentation("256")).toBe(256);
	});

	it("should convert full numbers", () => {
		expect(parseNumberRepresentation("120,000 views")).toBe(120000);
		expect(parseNumberRepresentation("120500 views")).toBe(120500);
		expect(parseNumberRepresentation("123456")).toBe(123456);
		expect(parseNumberRepresentation("256,000,1235")).toBe(2560001235);
	});
});
