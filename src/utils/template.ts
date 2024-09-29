import JSON5 from "json5";
import JSZip from "jszip";
import { nanoid } from "nanoid";
import type { TemplateManifest } from "@/types/template";

export const accept = ".bilifans";

export async function importTemplate(file: File): Promise<TemplateManifest<Blob> | undefined> {
  const zip = new JSZip();
  const zipFile = await zip.loadAsync(file);
  const manifest = zipFile.file("manifest.jsonc");
  const background = zipFile.file("background.png");
  if (manifest) {
    const manifestContent = await manifest.async("string");
    const manifestJson = JSON5.parse(manifestContent);
    const backgroundBlob = background ? await background.async("blob") : undefined;
    const template: TemplateManifest<Blob> = {
      ...manifestJson,
      id: nanoid(),
      type: "custom",
      cardStyle: {
        ...manifestJson.cardStyle,
        background: {
          ...manifestJson.cardStyle.background,
          image: backgroundBlob,
        },
      },
    };
    return template;
  }
}

export async function exportTemplate(template: TemplateManifest<string | Blob>): Promise<Blob> {
  const zip = new JSZip();
  const { type, id, ...rest } = template;
  const targetTemplate: Omit<TemplateManifest<string>, "type" | "id"> = {
    ...rest,
    cardStyle: {
      ...rest.cardStyle,
      background: {
        ...rest.cardStyle.background,
        image: undefined,
      },
    },
  };
  zip.file("manifest.jsonc", JSON5.stringify(targetTemplate, null, 2));
  if (template.cardStyle.background.image) {
    zip.file("background.png", new File([await imageToBlob(template.cardStyle.background.image)], "background.png"));
  }
  const blob = await zip.generateAsync({ type: "blob" });
  return blob;
}

export async function imageToBlob(image: string | Blob) {
  if (typeof image === "string") {
    const img = document.createElement("img");
    img.src = image;
    await img.decode();
    const canvas = document.createElement("canvas");
    canvas.width = img.width;
    canvas.height = img.height;
    const ctx = canvas.getContext("2d")!;
    ctx.drawImage(img, 0, 0);
    const blob = await new Promise<Blob>((resolve, reject) => {
      canvas.toBlob((blob) => {
        if (blob) {
          resolve(blob);
        }
        reject(new Error("Failed to convert image to blob"));
      });
    });
    return blob;
  }
  return image;
}
