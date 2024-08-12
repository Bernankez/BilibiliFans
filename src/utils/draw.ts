export interface RawDrawOptions {
  // font size should be inferred from width
  width: number;
  height: number;
  avatar: string;
  nickname: string;
  no: number;
  date: string;
  color: string;
  background: {
    image: string;
    // x,y
    origin?: [number, number];
    // w,h
    size?: [number, number];
    color?: string;
  };
  foreground?: {
    color?: string;
    gradient?: {
      left?: number;
      right?: number;
    };
  };
}

export type DrawOptions = ReturnType<typeof resolveOptions>;

export function resolveOptions(options: RawDrawOptions) {
  const fontSize = options.width / 30.375;
  const borderRadius = fontSize * 0.375;
  return {
    ...options,
    fontSize,
    borderRadius,
  };
}

export function generate(options: RawDrawOptions) {
  const drawOptions = resolveOptions(options);
  const { width, height } = drawOptions;
  let canvas: OffscreenCanvas | HTMLCanvasElement;
  if (typeof OffscreenCanvas !== "undefined") {
    canvas = createOffscreenCanvas(width, height);
  } else {
    canvas = createCanvas(width, height);
  }
  return draw(canvas, drawOptions);
}

export async function draw(canvas: HTMLCanvasElement | OffscreenCanvas, options: DrawOptions) {
  const ctx = canvas.getContext("2d") as OffscreenCanvasRenderingContext2D | CanvasRenderingContext2D | null;
  if (!ctx) {
    throw new Error("Failed to get canvas context");
  }
  drawRoundedRect(ctx, 0, 0, options.width, options.height, options.borderRadius);
  await drawBackground(ctx, options);
  return canvas;
}

export function drawRoundedRect(ctx: CanvasRenderingContext2D | OffscreenCanvasRenderingContext2D, x: number, y: number, width: number, height: number, radius: number) {
  ctx.beginPath();
  ctx.moveTo(x + radius, y);
  ctx.lineTo(x + width - radius, y);
  ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
  ctx.lineTo(x + width, y + height - radius);
  ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
  ctx.lineTo(x + radius, y + height);
  ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
  ctx.lineTo(x, y + radius);
  ctx.quadraticCurveTo(x, y, x + radius, y);
  ctx.closePath();
  ctx.fill();
}

export async function drawBackground(ctx: CanvasRenderingContext2D | OffscreenCanvasRenderingContext2D, options: DrawOptions) {
  const { background } = options;
  if (background.image) {
    const image = new Image();
    image.src = background.image;
    await image.decode();
    const { borderRadius } = options;
    // draw image with border radius
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(options.width, 0);
    ctx.lineTo(options.width, options.height);
    ctx.lineTo(0, options.height);
    ctx.closePath();
    ctx.clip();
    ctx.save();
    ctx.beginPath();
    ctx.moveTo(borderRadius, 0);
    ctx.lineTo(options.width - borderRadius, 0);
    ctx.quadraticCurveTo(options.width, 0, options.width, borderRadius);
    ctx.lineTo(options.width, options.height - borderRadius);
    ctx.quadraticCurveTo(options.width, options.height, options.width - borderRadius, options.height);
    ctx.lineTo(borderRadius, options.height);
    ctx.quadraticCurveTo(0, options.height, 0, options.height - borderRadius);
    ctx.lineTo(0, borderRadius);
    ctx.quadraticCurveTo(0, 0, borderRadius, 0);
    ctx.closePath();
    ctx.clip();
    ctx.drawImage(image, options.background.origin![0], options.background.origin![1], options.background.size![0], options.background.size![1], 0, 0, options.width, options.height);
    ctx.restore();
  }
}
