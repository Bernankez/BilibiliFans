/// <reference lib="WebWorker" />

import { type RawDrawOptions, render } from "@/utils/draw";

globalThis.addEventListener("message", async (e) => {
  const { data: rawDrawOptions } = e;
  const offscreenCanvas = await render(rawDrawOptions as RawDrawOptions) as OffscreenCanvas;
  try {
    const imageBitmap = offscreenCanvas.transferToImageBitmap();
    globalThis.postMessage(imageBitmap, [imageBitmap]);
  } catch (e) {
    console.warn(e);
  }
});
