import { fileURLToPath, URL } from "node:url";

import { defineConfig, loadEnv } from 'vite';
import vue from "@vitejs/plugin-vue";
// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');

  return {
    build: {
      commonjsOptions: {
        include: ["tailwind.config.js", "node_modules/**"],
      },
    },
    optimizeDeps: {
      include: ["tailwind-config"],
    },
    plugins: [vue()],
    resolve: {
      alias: {
        "@": fileURLToPath(new URL("./src", import.meta.url)),
        "tailwind-config": fileURLToPath(
          new URL("./tailwind.config.js", import.meta.url)
        ),
      },
    },
    define: {
      'process.env': env
    },
    server: {
      allowedHosts: true,
      watch: {
        ignored: ['**/node_modules/**', '**/dist/**', '**/uploads/**'],
      }
    },

  }
});
