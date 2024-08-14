<script setup lang="ts">
import dayjs from "dayjs";
import Avatar from "@/assets/img/avatar.jpg";
import Background from "@/assets/img/background.jpeg";
import { resizeCanvas } from "@/utils/canvas";
import type { RawDrawOptions } from "@/utils/draw";
// @see https://github.com/vitejs/vite/issues/11823
import DrawWorkerUrl from "@/workers/draw.ts?worker&url";

const props = withDefaults(defineProps<Omit<RawDrawOptions, "width" | "height">>(), {
  avatar: Avatar,
  nickname: "科科Cole",
  no: 1,
  date: dayjs().format("YYYY/MM/DD"),
  color: "#fff",
  background: () => ({
    image: Background,
    origin: [0, 200],
    size: [1125, 463],
  }),
  foreground: () => ({
    color: "#eaba80",
    gradient: {
      leftStart: 0.19,
      leftEnd: 0.35,
      rightStart: 0,
      rightEnd: 0.27,
    },
  }),
});

const width = ref(0);
const height = ref(0);

const divRef = ref<HTMLDivElement>();

const options = computed<RawDrawOptions>(() => ({
  ...props,
  width: width.value,
  height: height.value,
}));

const { post, data } = useWebWorker<ImageBitmap>(DrawWorkerUrl, {
  type: "module",
});

watch(options, () => {
  render();
}, {
  deep: true,
});

useResizeObserver(divRef, (entries) => {
  const { width: w } = entries[0].contentRect;
  const h = Math.round(w * 0.4115);
  if (divRef.value) {
    divRef.value.style.height = `${h}px`;
  }
  width.value = w;
  height.value = h;
  requestAnimationFrame(() => {
    render();
  });
});

function render() {
  post(options.value);
}

watch(data, (imageBitmap) => {
  if (imageBitmap) {
    draw(imageBitmap);
  }
}, {
  immediate: true,
});

function draw(imageBitmap: ImageBitmap) {
  if (divRef.value) {
    let canvas: HTMLCanvasElement | undefined;
    canvas = divRef.value.children?.[0] as HTMLCanvasElement | undefined;
    if (!(canvas instanceof HTMLCanvasElement)) {
      canvas = document.createElement("canvas");
      divRef.value.appendChild(canvas);
    }
    resizeCanvas(canvas, width.value, height.value);
    canvas.getContext("2d")?.drawImage(imageBitmap, 0, 0);
    imageBitmap.close();
  }
}

defineExpose({
  options,
});
</script>

<template>
  <div ref="divRef" class="w-full"></div>
</template>
