/// <reference types="vitest" />
import legacy from "@vitejs/plugin-legacy";
import vue from "@vitejs/plugin-vue";
import { resolve } from "path";
import Unocss from "unocss/vite";
import { defineConfig } from "vite";
import { viteMockServe } from "vite-plugin-mock";

// https://vitejs.dev/config/
export default defineConfig(({ mode, command }) => ({
  plugins: [
    vue({
      reactivityTransform: true,
    }),
    Unocss(),
    viteMockServe({
      mockPath: "src/mock",
      localEnabled: mode === "mock",
    }),
    legacy({
      targets: ["defaults", "not IE 11"],
    }),
  ],
  server: {
    host: "0.0.0.0",
  },
  resolve: {
    alias: {
      "@": resolve(__dirname, "./src"),
      "~": resolve(__dirname, "./"),
    },
  },
}));
