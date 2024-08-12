export function createCanvas(width: number, height: number) {
  const canvas = document.createElement("canvas");
  const ratio = window.devicePixelRatio;
  canvas.width = width * ratio;
  canvas.height = height * ratio;
  canvas.style.width = `${width}px`;
  canvas.style.height = `${height}px`;
  return canvas;
}

export function createOffscreenCanvas(width: number, height: number) {
  const canvas = new OffscreenCanvas(width, height);
  return canvas;
}
