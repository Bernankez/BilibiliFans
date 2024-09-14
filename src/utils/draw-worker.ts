import DrawWorkerUrl from "@/workers/draw.ts?worker&url";
import { klona } from "klona";
import type { RawDrawOptions } from "@/utils/draw";

export function draw(options: RawDrawOptions) {
  const worker = new Worker(DrawWorkerUrl, {
    type: "module",
  });
  return new Promise<ImageBitmap>((resolve) => {
    worker.onmessage = (e) => {
      resolve(e.data);
    };
    worker.postMessage(klona(options));
  });
}
