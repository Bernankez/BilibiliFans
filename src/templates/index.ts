import JSON5 from "json5";
import type { TemplateManifest } from "@/types/template";

export async function resolveDefaultTemplates() {
  const manifestModules = import.meta.glob("./**/manifest.jsonc", {
    query: "?raw",
    import: "default",
  });

  const backgroundModules = import.meta.glob("./**/background.png", {
    import: "default",
  });

  const templates: TemplateManifest<string>[] = [];

  for (const module in manifestModules) {
    const dirname = module.split("/")[1];
    const json = await manifestModules[module]() as string;
    const manifest = JSON5.parse<TemplateManifest>(json);
    let backgroundImage: string | undefined;
    if (`./${dirname}/background.png` in backgroundModules) {
      backgroundImage = await backgroundModules[`./${dirname}/background.png`]() as string;
    }
    templates.push({
      ...manifest,
      type: "default",
      cardStyle: {
        ...manifest.cardStyle,
        background: {
          ...manifest.cardStyle.background,
          image: backgroundImage,
        },
      },
    });
  }

  return templates;
}
