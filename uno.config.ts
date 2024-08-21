import { defineConfig, presetIcons, presetTypography, presetUno, transformerDirectives } from "unocss";

export default defineConfig({
  presets: [presetUno(), presetIcons(), presetTypography()],
  transformers: [transformerDirectives()],
  theme: {
    colors: {
      background: "rgb(var(--background))",
      foreground: "rgb(var(--foreground))",
      primary: {
        DEFAULT: "rgb(var(--primary))",
        foreground: "rgb(var(--primary-foreground))",
      },
      secondary: {
        DEFAULT: "rgb(var(--secondary))",
        foreground: "rgb(var(--secondary-foreground))",
      },
      accent: {
        DEFAULT: "rgb(var(--accent))",
        foreground: "rgb(var(--accent-foreground))",
      },
      muted: {
        DEFAULT: "rgb(var(--muted))",
        foreground: "rgb(var(--muted-foreground))",
      },
      border: "rgb(var(--border))",
      info: {
        DEFAULT: "rgb(var(--info))",
        foreground: "rgb(var(--info-foreground))",
      },
      success: {
        DEFAULT: "rgb(var(--success))",
        foreground: "rgb(var(--success-foreground))",
      },
      warning: {
        DEFAULT: "rgb(var(--warning))",
        foreground: "rgb(var(--warning-foreground))",
      },
      error: {
        DEFAULT: "rgb(var(--error))",
        foreground: "rgb(var(--error-foreground))",
      },
    },
    borderRadius: {
      lg: "var(--radius)",
      md: "calc(var(--radius) - 2px)",
      sm: "calc(var(--radius) - 4px)",
    },
  },
});
