import { defineConfig } from 'vite';

// https://vitejs.dev/config
export default defineConfig({
  build: {
    sourcemap: true,
    outDir: '.vite/build',
    lib: {
      entry: './src/main/main.ts',
      formats: ['cjs']
    },
    rollupOptions: {
      external: ['node:os', 'node-pty', 'node:path', 'node-ssh']
    }
  }
});
