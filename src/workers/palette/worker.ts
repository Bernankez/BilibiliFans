/// <reference lib="WebWorker" />

import { analyze } from "@/utils/rgbaster";

globalThis.addEventListener("message", async (e) => {
  const { data } = e;
  const { url, width, height } = data as { url: string; width: number; height: number };
  const result = await analyze(url, { width, height, scale: 0.6 });
  globalThis.postMessage(result);
});
