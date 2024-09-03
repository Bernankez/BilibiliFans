import analyze from "rgbaster";
import type { MaybeRefOrGetter } from "vue";

export interface Palette {
  color: string;
  count: number;
}

export function usePalette(image: MaybeRefOrGetter<Blob | string | undefined>, count = 3) {
  const palette = ref<Palette[]>([]);

  const { url } = useBlobUrl(image);

  watch(url, async (url) => {
    if (url) {
      const result = await analyze(url, { scale: 0.6 });
      palette.value = result.slice(0, count).map(({ color, count }) => ({
        color: rgb2hex(color),
        count,
      }));
    } else {
      palette.value = [];
    }
  }, { immediate: true });

  return { palette };
}

function rgb2hex(text: string) {
  const [r, g, b] = text.match(/\d+/g)!.map(Number);
  return `#${r.toString(16).padStart(2, "0")}${g.toString(16).padStart(2, "0")}${b.toString(16).padStart(2, "0")}ff`;
}

// #ref: https://juejin.cn/post/6844903511956815885
export function inferFontColor(hex: string) {
  const colors = hex.match(/\w\w/g)!.map(String).map(v => Number.parseInt(v, 16));
  const grayLevel = Number(colors[0]) * 0.299 + Number(colors[1]) * 0.587 + Number(colors[2]) * 0.114;
  if (grayLevel >= 192) {
    return "#333333";
  } else {
    return "#ffffff";
  }
}
