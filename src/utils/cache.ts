import { isWebWorker } from "./is";

// TODO LRU Cache

export async function resolveImage(image: string, alt?: string) {
  if (isWebWorker()) {
    const response = await fetch(image);
    const blob = await response.blob();
    const imageBitmap = await createImageBitmap(blob);
    return imageBitmap;
  } else {
    const img = new Image();
    img.src = image;
    if (alt) {
      img.alt = alt;
    }
    await img.decode();
    return img;
  }
}
