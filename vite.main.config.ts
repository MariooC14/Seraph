import { defineConfig } from "vite";

// https://vitejs.dev/config
export default defineConfig({
  build: {
    rollupOptions: {
      external: ["node:os", "node-pty", "node:path"],
    },
  },
});
