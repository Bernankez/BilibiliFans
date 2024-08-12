import { resolve } from "node:path";
import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import UnoCSS from "unocss/vite";
import VueDevTools from "vite-plugin-vue-devtools";
import AutoImport from "unplugin-auto-import/vite";
import Components from "unplugin-vue-components/vite";
import { NaiveUiResolver } from "unplugin-vue-components/resolvers";
import { UtilsResolver } from "@bernankez/utils/resolver";
import FontCarrier, { numberChars } from "vite-plugin-font-carrier";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    UnoCSS(),
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
      dirs: ["./src/composables/**", "./src/utils/**", "./src/store/**"],
      vueTemplate: true,
      resolvers: [UtilsResolver()],
    }),
    Components({
      dirs: ["./src/components/**"],
      resolvers: [NaiveUiResolver()],
    }),
    FontCarrier({
      fonts: [
        {
          path: "./src/assets/font/Kenney-Mini-Square.ttf",
          input: numberChars,
        },
      ],
      type: "woff2",
    }),
    VueDevTools(),
  ],
  resolve: {
    alias: {
      "@": resolve(__dirname, "src"),
      "~": resolve(__dirname, "."),
    },
  },
});
