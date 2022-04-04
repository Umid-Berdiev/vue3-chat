import { fileURLToPath, URL } from "url";

import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";

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
      // with options
      "^/api": {
        target: "http://localhost",
        port: 8889,
        changeOrigin: true,
        rewrite: (path: string) => path.replace(/^\/api/, ""),
        // secure: false,
        ws: true,
      },
    },
  },
});
