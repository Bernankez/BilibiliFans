<script setup lang="ts">
import { resizeCanvas } from "@/utils/canvas";
import { checkVisibility } from "@/utils/dom";
import dayjs from "dayjs";
import { klona } from "klona";
// @see https://github.com/vitejs/vite/issues/11823
import DrawWorkerUrl from "@/workers/draw/worker.ts?worker&url";
import type { RawDrawOptions } from "@/utils/draw";

export interface FansCardProps {
  avatar?: string;
  nickname?: string;
  no?: number;
  date?: string;
  color?: string;
  background?: {
    image?: string | Blob;
    origin?: [number, number];
    size?: [number, number];
    color?: string;
  };
  foreground?: {
    gradient: {
      [K in "left" | "right"]?: {
        color: string;
        start: number;
        end: number;
      };
    };
  };
}

const props = withDefaults(defineProps<FansCardProps>(), {
  nickname: "科科Cole",
  no: 1,
  date: dayjs().format("YYYY/MM/DD"),
  color: "#fff",
});

const width = ref(0);
const height = ref(0);

const divRef = ref<HTMLDivElement>();

const options = computed<RawDrawOptions>(() => ({
  width: width.value,
  height: height.value,
  template: {
    cardStyle: {
      color: props.color,
      background: props.background,
      foreground: props.foreground,
    },
  },
  user: {
    avatar: props.avatar,
    nickname: props.nickname,
    no: props.no,
    date: props.date,
  },
}));

const { post, data } = useWebWorker<ImageBitmap>(DrawWorkerUrl, {
  type: "module",
});

// NOTE useBlobUrl should place before watch options
const { url } = useBlobUrl(computed(() => options.value.template?.cardStyle.background?.image));
watch(options, () => {
  render();
}, {
  deep: true,
});

useResizeObserver(divRef, (entries) => {
  if (!divRef.value || !checkVisibility(divRef.value)) {
    return;
  }
  const { width: w } = entries[0].contentRect;
  const h = Math.round(w * 0.4115);
  divRef.value.style.height = `${h}px`;
  width.value = w;
  height.value = h;
  requestAnimationFrame(() => {
    render();
  });
});

function render() {
  if (!options.value.template?.cardStyle.background) {
    return;
  }
  const _options = klona(options.value);
  if (_options.template?.cardStyle.background) {
    _options.template.cardStyle.background.image = url.value;
  }
  post(_options);
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
  <div ref="divRef"></div>
</template>
