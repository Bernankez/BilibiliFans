/// <reference types="vitest" />
import { resolve } from "path";
import legacy from "@vitejs/plugin-legacy";
import vue from "@vitejs/plugin-vue";
import Unocss from "unocss/vite";
import { defineConfig } from "vite";
import { viteMockServe } from "vite-plugin-mock";
import { VitePWA } from "vite-plugin-pwa";

// https://vitejs.dev/config/
export default defineConfig(({ mode, command }) => ({
  plugins: [
    vue({
      reactivityTransform: true,
    }),
    VitePWA({
      registerType: "autoUpdate",
      includeAssets: ["favicon.ico", "apple-touch-icon.png", "masked-icon.svg"],
      manifest: {
        name: "Bilibili fans",
        short_name: "Bli-fans",
        description: "A tool making bilibili fans card",
        icons: [
          {
            src: "/pwa-192x192.png",
            sizes: "192x192",
            type: "image/png",
          },
          {
            src: "/pwa-512x512.png",
            sizes: "512x512",
            type: "image/png",
          },
          {
            src: "/pwa-512x512.png",
            sizes: "512x512",
            type: "image/png",
            purpose: "any maskable",
          },
        ],
        theme_color: "#ffffff",
        background_color: "#ffffff",
        display: "standalone",
      },
      devOptions: {
        enabled: true,
      },
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
