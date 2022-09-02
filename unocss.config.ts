import { defineConfig, presetUno, presetIcons, transformerDirectives } from "unocss";
import presetRemToPx from "@unocss/preset-rem-to-px";
import { colorBackground } from "./src/style/theme";

export default defineConfig({
  presets: [presetUno(), presetRemToPx(), presetIcons()],
  theme: {
    colors: {
      background: colorBackground,
    },
  },
  transformers: [transformerDirectives()],
});
