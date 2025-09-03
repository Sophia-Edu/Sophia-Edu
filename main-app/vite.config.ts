import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";

// Export a function so we can load mode-specific env vars and configure the dev proxy
export default ({ mode }: { mode: string }) => {
    // Avoid referencing Node's `process` type to satisfy the linter when
    // `@types/node` is not installed. loadEnv accepts a directory string;
    // use current working directory via URL fallback.
    const cwd = new URL(".", import.meta.url).pathname.replace(/\/$/, "");
    const env = loadEnv(mode, cwd);
    const apiTarget = (env.VITE_API_BASE as string) || "https://carlomagg675.pythonanywhere.com";

    return defineConfig({
        plugins: [react()],
        server: {
            proxy: {
                // Proxy local /api requests to the remote backend in development
                "/api": {
                    target: apiTarget,
                    changeOrigin: true,
                    secure: false,
                    rewrite: (path) => path.replace(/^\/api/, ""),
                },
            },
        },
    });
};

// http://127.0.0.1:5000
// https://carlomagg675.pythonanywhere.com
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


