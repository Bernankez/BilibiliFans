export function create(width: number, height: number) {
  if (typeof OffscreenCanvas !== "undefined") {
    return createOffscreenCanvas(width, height);
  }
  return createCanvas(width, height);
}

export function getContext(canvas: HTMLCanvasElement | OffscreenCanvas) {
  const ctx = canvas.getContext("2d") as CanvasRenderingContext2D | OffscreenCanvasRenderingContext2D | null;
  if (!ctx) {
    throw new Error("Failed to get canvas context");
  }
  return ctx;
}

export function resizeCanvas(canvas: HTMLCanvasElement | OffscreenCanvas, width: number, height: number) {
  if (canvas instanceof OffscreenCanvas) {
    canvas.width = width;
    canvas.height = height;
    return canvas;
  } else {
    const ratio = window.devicePixelRatio;
    canvas.width = width * ratio;
    canvas.height = height * ratio;
    return canvas;
  }
}

export function createCanvas(width: number, height: number) {
  const canvas = document.createElement("canvas");
  resizeCanvas(canvas, width, height);
  canvas.style.width = `${width}px`;
  canvas.style.height = `${height}px`;
  return canvas;
}

export function createOffscreenCanvas(width: number, height: number) {
  const canvas = new OffscreenCanvas(width, height);
  return canvas;
}
