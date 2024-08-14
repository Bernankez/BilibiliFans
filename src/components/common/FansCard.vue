<script setup lang="ts">
import KenneyMini from "@/assets/font/Kenney-Mini-Square.ttf";
import Avatar from "@/assets/img/avatar.jpg";
import Background from "@/assets/img/background.jpeg";
import type { RawDrawOptions } from "@/utils/draw";
// @see https://github.com/vitejs/vite/issues/11823
import DrawWorkerUrl from "@/workers/draw.ts?worker&url";

const divRef = ref<HTMLDivElement>();

const KenneyMiniFont = "kenney mini";
const { loaded } = useFont(KenneyMiniFont, `url(${KenneyMini})`);

const { post, data } = useWebWorker(DrawWorkerUrl, {
  type: "module",
});

const rawOptions = shallowRef<RawDrawOptions>({
  width: 486,
  height: 200,
  avatar: Avatar,
  nickname: "科科Cole",
  no: 4597,
  date: "2022/04/21",
  color: "#ffffff",
  background: {
    image: Background,
    origin: [100, 250] as [number, number],
    size: [972, 400] as [number, number],
    color: "#333333",
  },
  foreground: {
    color: "#EABA80",
    gradient: {
      leftStart: 0,
      leftEnd: 1,
      rightStart: 0,
      rightEnd: 0.5,
    },
  },
});

watchEffect(() => {
  if (loaded.value) {
    post(rawOptions.value);
  }
});

watchEffect(async () => {
  if (divRef.value && loaded.value && data.value) {
    const blob = data.value;
    const url = URL.createObjectURL(blob);
    const img = new Image();
    img.src = url;
    img.alt = "fans-card";
    await img.decode();
    divRef.value.appendChild(img);
  }
});
</script>

<template>
  <div>
    <div ref="divRef" class="h-[200px] w-[486px]"></div>
  </div>
  <div>
    <button @click="post(rawOptions)">
      test
    </button>
  </div>
</template>
