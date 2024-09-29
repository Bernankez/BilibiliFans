import { klona } from "klona";
import type { RawDrawOptions } from "@/utils/draw";
import DrawWorkerUrl from "./worker.ts?worker&url";

export function draw(options: RawDrawOptions) {
  const worker = new Worker(DrawWorkerUrl, {
    type: "module",
  });
  return new Promise<ImageBitmap>((resolve) => {
    worker.onmessage = (e) => {
      resolve(e.data);
      worker.terminate();
    };
    worker.postMessage(klona(options));
  });
}
