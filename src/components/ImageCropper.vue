<template>
  <div class="shrink-0 w-400px h-400px">
    <VueCropper
      ref="vueCropperEl"
      :img="image"
      outputType="png"
      :canScale="false"
      autoCrop
      fixed
      :fixedNumber="[73, 30]"
      :maxImgSize="4096"
      @realTime="realTimePreview">
    </VueCropper>
  </div>
</template>

<script setup lang="ts">
import { Preview } from "@/types";
import { reactive } from "vue";
import { VueCropper } from "vue-cropper";
import "vue-cropper/dist/index.css";

const { image = "" } = defineProps<{
  image?: string | Blob;
}>();
const emit = defineEmits<{
  (event: "preview", preview: Preview): void;
}>();

let preview = reactive<Preview>({
  src: "",
  imageStyle: {},
  containerStyle: {},
});
const vueCropperEl = $ref<typeof VueCropper>();

function realTimePreview(data: Record<string, any>) {
  preview.src = data.url;
  preview.imageStyle = data.img;
  preview.containerStyle = {
    width: data.w + "px",
    height: data.h + "px",
    zoom: 200 / data.h,
  };
  emit("preview", preview);
}

defineExpose({
  getCrop() {
    return new Promise((resolve, reject) => {
      vueCropperEl.getCropData((data: string) => {
        resolve(data);
      });
    });
  },
});
</script>

<style lang="scss" scoped></style>
