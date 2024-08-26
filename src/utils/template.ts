import JSZip from "jszip";
import JSON5 from "json5";
import type { TemplateManifest } from "@/types/template";

export const accept = ".bilifans";

export async function importTemplate(file: File): Promise<TemplateManifest<Blob>> {
  const zip = new JSZip();
  const zipFile = await zip.loadAsync(file);
  const manifest = zipFile.file("manifest.jsonc")!;
  const background = zipFile.file("background.png")!;
  const manifestContent = await manifest.async("string");
  const manifestJson = JSON5.parse(manifestContent);
  const backgroundBlob = await background.async("blob");
  const template = {
    ...manifestJson,
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

export async function exportTemplate(template: TemplateManifest<string | Blob>): Promise<Blob> {
  const zip = new JSZip();
  const { type, ...rest } = template;
  const targetTemplate: Omit<TemplateManifest<string>, "type"> = {
    ...rest,
    cardStyle: {
      ...rest.cardStyle,
      background: {
        ...rest.cardStyle.background,
        image: "background",
      },
    },
  };
  zip.file("manifest.jsonc", JSON5.stringify(targetTemplate, null, 2));
  zip.file("background.png", new File([await imageToBlob(template.cardStyle.background.image)], "background.png"));
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
