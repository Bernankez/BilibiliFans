import { resolveImage } from "./cache";
import { create, getContext } from "./canvas";

export interface PaletteOptions {
  width: number;
  height: number;
  ignore?: string[];
  scale?: number;
  skipTransparentPixels?: boolean;
}

export interface Palette {
  color: string;
  count: number;
}

export async function analyze(src: Blob | string, options: PaletteOptions): Promise<Palette[] > {
  const {
    ignore = [], // for example, to ignore white and black:  [ 'rgb(0,0,0)', 'rgb(255,255,255)' ]
    scale = 1, // 0 = best performance, lowest fidelity
    // 1 = best fidelity, worst performance
  } = options;

  if (scale > 1 || scale <= 0) {
    console.warn(`You set scale to ${scale}, which isn't between 0-1. This is either pointless (> 1) or a no-op (≤ 0)`);
  }

  const width = options.width * scale;
  const height = options.height * scale;

  const data = await getImageData(src, { width, height });
  return getCounts(data, ignore);
}

export async function getImageData(src: Blob | string, options: { width: number;height: number }): Promise<Uint8ClampedArray> {
  const { width, height } = options;
  const canvas = create(width, height);
  const ctx = getContext(canvas);
  const img = (await resolveImage(src))!;
  ctx.drawImage(img, 0, 0, width, height);
  const { data } = ctx.getImageData(0, 0, width, height);
  return data;
}

export function getCounts(data: Uint8ClampedArray, ignore: string[]): Palette[] {
  const countMap: Record<string, Palette> = {};

  for (let i = 0; i < data.length; i += 4 /* 4 gives us r, g, b, and a */) {
    const alpha: number = data[i + 3];
    // skip FULLY transparent pixels
    if (alpha === 0) {
      continue;
    }

    const rgbComponents: (number | undefined)[] = Array.from(data.subarray(i, i + 3));

    // skip undefined data
    if (rgbComponents.includes(undefined)) {
      continue;
    }

    const color: string = alpha && alpha !== 255
      ? `rgba(${[...rgbComponents, alpha].join(",")})`
      : `rgb(${rgbComponents.join(",")})`;

    // skip colors in the ignore list
    if (ignore.includes(color)) {
      continue;
    }

    if (countMap[color]) {
      countMap[color].count++;
    } else {
      countMap[color] = { color, count: 1 };
    }
  }

  const counts = Object.values(countMap) as Palette[];
  return counts.sort((a, b) => b.count - a.count);
}
