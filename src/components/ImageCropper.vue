<template>
  <div class="shrink-0 wrapper">
    <VueCropper
      ref="vueCropperEl" :img="image" output-type="png" :can-scale="options.imageScale"
      :can-move="options.imageMove" auto-crop :center-box="options.boxInsideImage" full fixed :fixed-number="[73, 30]"
      :max-img-size="4096" @real-time="onPreview" @img-load="imgLoad"
    />
  </div>
</template>

<script setup lang="ts">
import { nextTick, watch, watchEffect } from "vue";
import { VueCropper } from "vue-cropper";
import { useCardStore } from "@/store/card-store";
import type { Preview } from "@/types";
import "vue-cropper/dist/index.css";

const { image: _image = null as string | Blob | null, width: _width = 400 } = defineProps<{
  image?: string | Blob;
  width?: number;
}>();
const emit = defineEmits<{
  (event: "preview", preview: Preview): void;
}>();
const width = $computed(() => `${_width}px`);
watch(() => _width, () => {
  vueCropperEl?.reload();
});

const cardStore = useCardStore();
const { options } = $(cardStore);

let prevImage = "";
const image = $computed(() => {
  prevImage && URL.revokeObjectURL(prevImage);
  if (_image instanceof Blob) {
    prevImage = URL.createObjectURL(_image);
    return prevImage;
  } else {
    return _image || "";
  }
});

const vueCropperEl = $ref<typeof VueCropper>();

function onPreview(data: Record<string, any>) {
  emit("preview", {
    src: data.url,
    imageStyle: data.img,
    containerStyle: {
      width: data.w,
      height: data.h,
    },
  });
}

function crop() {
  return new Promise((resolve, reject) => {
    vueCropperEl?.getCropData((data: string) => {
      resolve(data);
    });
  });
}
// default crop
let imgLoaded = $ref(false);
const imgLoad = () => {
  nextTick(() => {
    imgLoaded = true;
  });
};
const setCrop = () => {
  vueCropperEl.cropOffsertX = 75;
  vueCropperEl.cropOffsertY = 43;
  vueCropperEl.cropW = 250;
  vueCropperEl.cropH = 103;
};
const setDefaultCrop = () => {
  if (imgLoaded) {
    setCrop();
  } else {
    const stop = watchEffect(() => {
      if (imgLoaded) {
        setCrop();
        stop();
      }
    });
  }
};

defineExpose({
  crop,
  reset() {
    vueCropperEl?.refresh();
  },
  setDefaultCrop,
});
</script>

<style lang="scss" scoped>
.wrapper {
  width: v-bind("width");
  height: v-bind("width");
}
</style>
