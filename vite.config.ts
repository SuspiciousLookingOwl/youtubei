/// <reference types="vitest" />
import { defineConfig } from "vite";

export default defineConfig({
	test: {
		globals: true,
		hookTimeout: 20000,
		testTimeout: 10000,
	},
});
