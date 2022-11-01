<template>
  <main
    class="min-w-fit w-full h-full flex p-3 box-border justify-evenly gap-4 items-center overflow-x-auto bg-background-light dark:bg-darkbackground transition-all duration-250"
  >
    <ImageCropper ref="imageCropperEl" :image="options.backgroundImage" @preview="onPreview" />
    <FansCard v-bind="options" class="shrink-0" :base-font-size="baseFontSize">
      <div :style="preview?.containerStyle">
        <img :src="preview?.src" :style="preview?.imageStyle" />
      </div>
    </FansCard>
    <FansCard v-show="false" ref="fansCardEl" v-bind="options" class="shrink-0" :base-font-size="36">
      <img class="w-full h-full" :src="finalImage" alt="backgroundImage" />
    </FansCard>
  </main>
</template>

<script setup lang="ts">
import { nextTick, onMounted } from "vue";
import FansCard from "@/components/FansCard.vue";
import ImageCropper from "@/components/ImageCropper.vue";
import { useCardStore } from "@/store/card-store";
import type { Preview } from "@/types";

const cardStore = useCardStore();
const { options, setDefault, baseFontSize } = $(cardStore);

const imageCropperEl = $ref<typeof ImageCropper>();
setDefault();
onMounted(() => {
  imageCropperEl.setDefaultCrop();
});

let preview = $ref<Preview | undefined>();
const onPreview = (_preview: Preview) => {
  preview = _preview;
};

let finalImage = $ref("");
const fansCardEl = $ref<typeof FansCard>();

const imageMIME = "image/png";
const imageSuffix = "png";
const onGenerate: () => Promise<void> = async () => {
  finalImage = await imageCropperEl.crop();
  await nextTick();
  return fansCardEl.snapshot().then((image: Blob) => {
    const filename = `${options.anchorName}-${options.fansNo}`;
    const file = new File([image], filename, { type: imageMIME, lastModified: new Date().valueOf() });
    const a = document.createElement("a");
    const url = URL.createObjectURL(file);
    a.href = url;
    a.download = `${filename}.${imageSuffix}`;
    a.click();
    URL.revokeObjectURL(url);
    finalImage = "";
  });
};

defineExpose({
  generate: onGenerate,
  resetCropper() {
    imageCropperEl.reset();
  },
});
</script>
