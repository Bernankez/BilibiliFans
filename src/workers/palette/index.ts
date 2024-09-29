import type { Palette } from "@/utils/rgbaster";
import PaletteWorkerUrl from "./worker?worker&url";

export function palette(url: string, width: number, height: number) {
  const worker = new Worker(PaletteWorkerUrl, {
    type: "module",
  });
  return new Promise<Palette[]>((resolve) => {
    worker.onmessage = (e) => {
      resolve(e.data);
      worker.terminate();
    };
    worker.postMessage({ url, width, height });
  });
}
