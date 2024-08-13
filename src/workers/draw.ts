/// <reference lib="WebWorker" />

import { type RawDrawOptions, render } from "@/utils/draw";

globalThis.addEventListener("message", async (e) => {
  const { data } = e;
  // eslint-disable-next-line no-console
  console.log(data);
  const offscreenCanvas = await render(data as RawDrawOptions) as OffscreenCanvas;
  globalThis.postMessage(await offscreenCanvas.convertToBlob());
});
