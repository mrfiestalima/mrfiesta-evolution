import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";
import { resolve } from "node:path";

export default defineConfig(({ mode }) => ({
  base:
    loadEnv(mode, process.cwd(), "").VITE_BASE_PATH || "/mrfiesta-evolution/",
  plugins: [react()],
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, "index.html"),
        admin: resolve(__dirname, "admin/index.html"),
      },
    },
  },
}));
