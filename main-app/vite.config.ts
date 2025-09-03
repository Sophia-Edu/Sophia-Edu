// import { defineConfig } from "vite";
// import react from "@vitejs/plugin-react";

// export default defineConfig({
// 	plugins: [react()],
// 	root: "./main-app", // Assuming main-app is your working directory
// 	build: {
// 		outDir: "dist", // Output directory
// 		// By default, Vite expects index.html in the root of the project, if your structure is different adjust accordingly
// 		// rollupOptions: {
// 		// 	input: {
// 		// 		main: "src/main.tsx", // Path to your main entry file if not using index.html
// 		// 	},
// 		// },
// 	},
// });

import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
	plugins: [react()],
	server: {
		proxy: {
			"/api": {
				target: "http://127.0.0.1:5000",
				changeOrigin: true,
				secure: false,
				rewrite: (path) => path.replace(/^\/api/, ""),
			},
			"/uploads": {
				target: "http://127.0.0.1:5000",
				changeOrigin: true,
				secure: false,
			},
			"/static": {
				target: "http://127.0.0.1:5000",
				changeOrigin: true,
				secure: false,
			},
		},
	},
	build: {
		outDir: "dist", // or any other directory you choose
	},
});
