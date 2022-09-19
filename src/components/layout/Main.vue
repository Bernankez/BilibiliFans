<template>
  <main
    class="min-w-fit w-full h-full flex p-3 box-border justify-evenly gap-4 items-center overflow-x-auto bg-background-light dark:bg-darkbackground transition-all duration-250">
    <ImageCropper ref="imageCropperEl" :image="options.backgroundImage" @preview="onPreview"></ImageCropper>
    <FansCard ref="fansCardEl" v-bind="options" class="shrink-0">
      <template #image>
        <img v-if="finalImage" class="w-full h-full" :src="finalImage" alt="backgroundImage" />
        <div v-else :style="preview?.containerStyle">
          <img :src="preview?.src" :style="preview?.imageStyle" />
        </div>
      </template>
    </FansCard>
  </main>
</template>

<script setup lang="ts">
import { useCardStore } from "@/store/card-store";
import { Preview } from "@/types";
import FansCard from "@/components/FansCard.vue";
import ImageCropper from "@/components/ImageCropper.vue";
import { nextTick } from "vue";

const cardStore = useCardStore();
const { options, setDefault } = $(cardStore);

setDefault();

let preview = $ref<Preview | undefined>();
const onPreview = (_preview: Preview) => {
  preview = _preview;
};

let finalImage = $ref("");
const imageCropperEl = $ref<typeof ImageCropper>();
const fansCardEl = $ref<typeof FansCard>();

const imageMIME = "image/png";
const imageSuffix = "png";
const onGenerate: () => Promise<void> = async () => {
  finalImage = await imageCropperEl.crop();
  await nextTick();
  return fansCardEl.snapshot().then((canvas: HTMLCanvasElement) => {
    const dataURL = canvas.toDataURL(imageMIME);
    const dataArr = dataURL.split(",");
    const MIME = dataArr[0].match(/:(.*?);/)?.[1];
    const bstr = window.atob(dataArr[1]);
    let n = bstr.length;
    const u8Arr = new Uint8Array(n);
    while (n--) {
      u8Arr[n] = bstr.charCodeAt(n);
    }
    const filename = options.anchorName + "-" + options.fansNo;
    const file = new File([u8Arr], filename, { type: MIME, lastModified: new Date().valueOf() });
    const a = document.createElement("a");
    const url = URL.createObjectURL(file);
    a.href = url;
    a.download = filename + "." + imageSuffix;
    a.click();
    URL.revokeObjectURL(url);
  });
};

defineExpose({
  generate: onGenerate,
});
</script>
