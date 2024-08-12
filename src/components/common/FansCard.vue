<script setup lang="ts">
import KenneyMini from "@/assets/font/Kenney-Mini-Square.ttf";
import Avatar from "@/assets/img/avatar.jpg";
import Background from "@/assets/img/background.jpeg";

// defineProps<{
//   width: number;
//   height: number;
//   avatar: string;
//   nickname: string;
//   no: number;
//   date: string;
//   color: string;
//   background: {
//     image: string;
//     // x,y
//     origin?: [number, number];
//     // w,h
//     size?: [number, number];
//     color?: string;
//   };
//   foreground?: {
//     color?: string;
//     gradient?: {
//       left?: number;
//       right?: number;
//     };
//   };
// }>();

const divRef = ref<HTMLDivElement>();

const KenneyMiniFont = "kenney mini";
const { loaded } = useFont(KenneyMiniFont, `url(${KenneyMini})`);

watchEffect(async () => {
  if (divRef.value && loaded.value) {
    const canvas = await generate({
      width: 400,
      height: 200,
      avatar: Avatar,
      nickname: "科科Cole",
      no: 1,
      date: "2024-03-01",
      color: "#ffffff",
      background: {
        image: Background,
        origin: [500, 400],
        size: [600, 300],
        color: "#ffffff",
      },
      foreground: {
        color: "#ffffff",
      },
    });
    if (canvas instanceof HTMLCanvasElement) {
      divRef.value.appendChild(canvas);
    } else {
      const blob = await canvas.convertToBlob();
      const url = URL.createObjectURL(blob);
      divRef.value.style.backgroundImage = `url(${url})`;
    }
  }
});
</script>

<template>
  <div ref="divRef" class="h-[200px] w-[400px]"></div>
</template>
