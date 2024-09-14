import { resolve } from "node:path";
import { UtilsResolver } from "@bernankez/utils/resolver";
import vue from "@vitejs/plugin-vue";
import vueJsx from "@vitejs/plugin-vue-jsx";
import UnoCSS from "unocss/vite";
import AutoImport from "unplugin-auto-import/vite";
import { NaiveUiResolver } from "unplugin-vue-components/resolvers";
import Components from "unplugin-vue-components/vite";
import Markdown from "unplugin-vue-markdown/vite";
import { transformLazyShow } from "v-lazy-show";
import { defineConfig } from "vite";
import FontCarrier, { numberChars } from "vite-plugin-font-carrier";
import { VitePWA } from "vite-plugin-pwa";
import VueDevTools from "vite-plugin-vue-devtools";

function createFontCarrier() {
  return FontCarrier({
    fonts: [
      {
        path: "./src/assets/font/Kenney-Mini-Square.ttf",
        input: numberChars,
      },
    ],
    type: "woff2",
  });
}

// https://vitejs.dev/config/
export default defineConfig(() => {
  return {
    plugins: [
      vue({
        include: [/\.vue$/, /\.tsx$/, /\.md$/],
        template: {
          compilerOptions: {
            nodeTransforms: [
              transformLazyShow,
            ],
          },
        },
      }),
      vueJsx(),
      UnoCSS(),
      Markdown({
        markdownItOptions: {
          html: true,
          linkify: true,
          typographer: true,
        },
      }),
      AutoImport({
        imports: [
          "vue",
          "vue-i18n",
          "vue-router",
          "@vueuse/core",
          "pinia",
          {
            "naive-ui": [
              "useDialog",
              "useMessage",
              "useNotification",
              "useLoadingBar",
            ],
          },
        ],
        dirs: ["./src/composables/**", "./src/store/**"],
        vueTemplate: true,
        resolvers: [UtilsResolver()],
      }),
      Components({
        dirs: ["./src/components/**"],
        resolvers: [NaiveUiResolver()],
      }),
      createFontCarrier(),
      VitePWA({
        registerType: "autoUpdate",
        includeAssets: ["favicon.ico", "apple-touch-icon.png", "masked-icon.svg"],
        manifest: {
          name: "BilibliFans",
          short_name: "BilibliFans",
          description: "A tool making bilibili fans card",
          theme_color: "#18a058",
          background_color: "#ffffff",
          display: "standalone",
          icons: [
            {
              src: "/favicon-32x32.png",
              sizes: "32x32",
              type: "image/png",
            },
            {
              src: "/android-chrome-192x192.png",
              sizes: "192x192",
              type: "image/png",
            },
            {
              src: "/android-chrome-512x512.png",
              sizes: "512x512",
              type: "image/png",
              purpose: "any",
            },
            {
              src: "/pwa-512x512.png",
              sizes: "512x512",
              type: "image/png",
              purpose: "maskable",
            },
          ],
        },
        workbox: {
          globPatterns: ["**/*.{js,css,html,png,jpg,svg,ttf,woff2}"],
        },
        devOptions: {
          enabled: true,
        },
      }),
      VueDevTools(),
    ],
    worker: {
      format: "es" as const,
      plugins: () => [createFontCarrier()],
    },
    resolve: {
      alias: {
        "@": resolve(__dirname, "src"),
        "~": resolve(__dirname, "."),
      },
    },
  };
});
