/// <reference lib="WebWorker" />

import { type RawDrawOptions, render } from "@/utils/draw";

const tasks: Promise<OffscreenCanvas>[] = [];

globalThis.addEventListener("message", async (e) => {
  const { data: rawDrawOptions } = e;
  const promise = render(rawDrawOptions as RawDrawOptions) as Promise<OffscreenCanvas>;
  tasks.push(promise);
  promise.then((offscreenCanvas) => {
    const index = tasks.findIndex(p => p === promise);
    // Only render the last task
    if (index === tasks.length - 1) {
      tasks.length = 0;
      const imageBitmap = offscreenCanvas.transferToImageBitmap();
      globalThis.postMessage(imageBitmap, [imageBitmap]);
    }
  });
});
