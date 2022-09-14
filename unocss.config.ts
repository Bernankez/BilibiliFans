import { defineConfig, presetUno, presetIcons, transformerDirectives } from "unocss";
import presetRemToPx from "@unocss/preset-rem-to-px";
import {
  textColor,
  textSecondary,
  colorBackground,
  colorBackgroundGray,
  colorBackgroundGrayDarker,
} from "./src/style/theme";

export default defineConfig({
  presets: [presetUno(), presetRemToPx(), presetIcons()],
  theme: {
    colors: {
      default: textColor,
      secondary: textSecondary,
      background: colorBackground,
      backgray: colorBackgroundGray,
      backgraydarker: colorBackgroundGrayDarker,
    },
  },
  transformers: [transformerDirectives()],
});
