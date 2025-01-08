import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tsconfigPaths from "vite-tsconfig-paths";
import path from "path";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tsconfigPaths()],

  server: {
    proxy: {
      "/ws": {
        target: "http://localhost:8080",
        changeOrigin: true,
        ws: true,
      },
    },
  },

  define: {
    global: {},
  },

  resolve: {
    alias: {
      "@": path.resolve("src"),
    },
  },
});
