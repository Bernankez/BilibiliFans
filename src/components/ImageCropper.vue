<template>
  <div class="shrink-0 w-400px h-400px">
    <VueCropper
      ref="vueCropperEl"
      :img="image"
      outputType="png"
      :canScale="false"
      :canMove="false"
      autoCrop
      centerBox
      full
      fixed
      :fixedNumber="[73, 30]"
      :maxImgSize="4096"
      @realTime="onPreview">
    </VueCropper>
  </div>
</template>

<script setup lang="ts">
import { Preview } from "@/types";
import { reactive } from "vue";
import { VueCropper } from "vue-cropper";
import "vue-cropper/dist/index.css";

const { image: _image = null as string | Blob | null } = defineProps<{
  image?: string | Blob;
}>();
const emit = defineEmits<{
  (event: "preview", preview: Preview): void;
}>();

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

const preview = reactive<Preview>({
  src: "",
  imageStyle: {},
  containerStyle: {},
});
const vueCropperEl = $ref<typeof VueCropper>();

function onPreview(data: Record<string, any>) {
  preview.src = data.url;
  preview.imageStyle = data.img;
  preview.containerStyle = {
    width: data.w + "px",
    height: data.h + "px",
    zoom: 200 / data.h,
  };
  emit("preview", preview);
}

function crop() {
  return new Promise((resolve, reject) => {
    vueCropperEl?.getCropData((data: string) => {
      resolve(data);
    });
  });
}

defineExpose({
  crop,
});
</script>

<style lang="scss" scoped></style>
