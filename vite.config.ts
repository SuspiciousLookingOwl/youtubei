/// <reference types="vitest" />
import path from "path";
import { defineConfig } from "vite";
import dts from "vite-plugin-dts";

const external = ["url", "events", "querystring", "https", "http", "zlib"];

export default defineConfig({
	plugins: [
		dts({
			entryRoot: "./src",
		}),
	],
	test: {
		globals: true,
	},
	esbuild: {
		minify: false,
	},
	build: {
		outDir: "dist",
		emptyOutDir: true,
		minify: false,
		lib: {
			entry: path.resolve(__dirname, "src/index.ts"),
			name: "youtubei",
			fileName: (format) => `index.${format}.js`,
		},
		rollupOptions: {
			external,
			output: {
				globals: Object.fromEntries(external.map((e) => [e, e])),
				inlineDynamicImports: true,
			},
		},
	},
});
