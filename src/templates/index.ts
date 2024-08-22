import JSON5 from "json5";
import type { TemplateManifest } from "@/types/template";

export async function loadTemplate(id: string): Promise<TemplateManifest> {
  const manifestJson = (await import(`./${id}/manifest.jsonc?raw`)).default;
  const manifest = JSON5.parse<TemplateManifest>(manifestJson);
  const backgroundImage = (await import(`./${id}/${manifest.cardStyle.background.image}.png`)).default;
  return {
    ...manifest,
    cardStyle: {
      ...manifest.cardStyle,
      background: {
        ...manifest.cardStyle.background,
        image: backgroundImage,
      },
    },
  };
}
