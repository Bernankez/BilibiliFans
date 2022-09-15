import { defineConfig, presetUno, presetIcons, transformerDirectives } from "unocss";
import presetRemToPx from "@unocss/preset-rem-to-px";
import {
  colorDefault,
  colorDarkDefault,
  colorDisabled,
  colorBackground,
  colorDarkBackground,
  colorPrimary,
} from "./src/style/theme";

export default defineConfig({
  presets: [presetUno(), presetRemToPx(), presetIcons()],
  theme: {
    colors: {
      default: colorDefault,
      darkDefault: colorDarkDefault,
      disabled: colorDisabled,
      background: colorBackground,
      darkBackground: colorDarkBackground,
      primary: colorPrimary,
    },
  },
  transformers: [transformerDirectives()],
});
