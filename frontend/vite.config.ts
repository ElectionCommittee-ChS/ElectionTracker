import { fileURLToPath, URL } from "node:url";

import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import { resolve } from "node:path";

// https://vitejs.dev/config/
export default defineConfig({
	plugins: [vue()],
	resolve: {
		alias: {
			"@": fileURLToPath(new URL("./src", import.meta.url)),
		},
	},
	server: {
		proxy: {
			// proxy all requests to data in development to the backend server, which is running on localhost:3000
			// In production this is handled by the backend server, which serves the frontend files and the data from the same origin
			"/data.json": "http://localhost:3000",
			"/history.json": "http://localhost:3000",
			"/history": "http://localhost:3000",
			"/total": "http://localhost:3000",
		},
	},
	build: {
		rollupOptions: {
			input: {
				main: resolve(__dirname, "index.html"),
				numbers: resolve(__dirname, "numbers/index.html"),
			},
		},
	},
});
