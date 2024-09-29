import { LRUCache } from "lru-cache";
import { isWebWorker } from "./is";

const cache = new LRUCache<string, ImageBitmap | HTMLImageElement>({
  max: 10,
});

export async function resolveImage(image: string | Blob | undefined, alt?: string): Promise<HTMLImageElement | ImageBitmap | undefined> {
  if (!image) {
    return;
  }
  if (image instanceof Blob) {
    const imageBitmap = await createImageBitmap(image);
    return imageBitmap;
  }
  const _isWebWorker = isWebWorker();
  const key = `${image}?${_isWebWorker ? "worker" : "browser"}`;
  if (cache.has(key)) {
    return cache.get(key)!;
  }
  if (_isWebWorker) {
    const response = await fetch(image);
    const blob = await response.blob();
    const imageBitmap = await createImageBitmap(blob);
    cache.set(key, imageBitmap);
    return imageBitmap;
  } else {
    const img = new Image();
    // Can't set cross origin to be anonymous for data url's
    // https://github.com/mrdoob/three.js/issues/1305
    if (!image.startsWith("data")) {
      img.crossOrigin = "Anonymous";
    }
    img.src = image;
    if (alt) {
      img.alt = alt;
    }
    await img.decode();
    cache.set(key, img);
    return img;
  }
}
