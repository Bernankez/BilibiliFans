<template>
  <main
    class="w-full h-full overflow-auto bg-background-light dark:bg-darkbackground transition-all duration-250"
  >
    <div class="h-full items-center" :class="autoAdjust ? 'lg:flex' : 'flex justify-evenly min-w-fit'">
      <div ref="imageCropperWrapper" class="p-3 box-border" :class="autoAdjust ? 'overflow-hidden flex-1' : ''">
        <ImageCropper ref="imageCropperEl" :image="options.backgroundImage" :width="imageCropperWidth" @preview="onPreview" />
      </div>
      <div ref="fansCardWrapper" class="p-3 box-border" :class="autoAdjust ? 'overflow-hidden flex-1' : ''">
        <FansCard v-bind="options" class="shrink-0" :base-font-size="baseFontSize">
          <div :style="preview?.containerStyle">
            <img :src="preview?.src" :style="preview?.imageStyle" />
          </div>
        </FansCard>
      </div>
    </div>
    <FansCard v-show="false" ref="fansCardEl" v-bind="options" class="shrink-0" :base-font-size="generateImageSize">
      <img class="w-full h-full" :src="finalImage" alt="backgroundImage" />
    </FansCard>
  </main>
</template>

<script setup lang="ts">
import { nextTick, onMounted, watchEffect } from "vue";
import { debounce } from "lodash-es";
import FansCard from "@/components/FansCard.vue";
import ImageCropper from "@/components/ImageCropper.vue";
import { useAppStore } from "@/store/app-store";
import { useCardStore } from "@/store/card-store";
import type { Preview } from "@/types";

const cardStore = useCardStore();
const { options, setDefault, quality } = $(cardStore);
let { baseFontSize: _baseFontSize } = $(cardStore);
const { autoAdjust } = $(useAppStore());

const generateImageSize = $computed(() => {
  if (quality === "default") {
    return 36;
  } else if (quality === "small") {
    return 20;
  } else if (quality === "large") {
    return 70;
  }
});

const imageCropperWrapper = $ref<HTMLDivElement>();
const imageCropperEl = $ref<typeof ImageCropper>();
setDefault();

const fansCardWrapper = $ref<HTMLDivElement>();

let _imageCropperWidth = $ref(0);
const imageCropperWidth = $computed(() => autoAdjust ? _imageCropperWidth : 400);
const baseFontSize = $computed(() => autoAdjust ? _baseFontSize : 16);
const debounced = debounce(resizeCb, 500);
const resizeObserver = new ResizeObserver(debounced);
function resizeCb(entries: ResizeObserverEntry[]) {
  for (const [index, entry] of entries.entries()) {
    if (index === 0) {
      _imageCropperWidth = entry.contentRect.width;
    } else if (index === 1) {
      const magnification = 16 * entry.contentRect.width / 486;
      _baseFontSize = magnification;
    }
  }
}
onMounted(() => {
  resizeObserver.observe(imageCropperWrapper);
  resizeObserver.observe(fansCardWrapper);
  imageCropperEl.setDefaultCrop();
});

let _preview = $ref<Preview | undefined>();
const preview = $computed<Preview | undefined>(() => {
  if (_preview) {
    return {
      src: _preview.src,
      imageStyle: _preview.imageStyle,
      containerStyle: {
        width: `${_preview.containerStyle.width}px`,
        height: `${_preview.containerStyle.height}px`,
        zoom: 30.375 * baseFontSize / (_preview.containerStyle.width as number),
      },
    };
  }
  return undefined;
});
const onPreview = (preview: Preview) => {
  _preview = preview;
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
