<script setup lang="ts">
import { CircleStencil, Cropper, RectangleStencil } from "vue-advanced-cropper";
import "vue-advanced-cropper/dist/style.css";
import Background from "@/assets/img/background.jpeg";

const props = withDefaults(defineProps<{
  type?: "circle" | "rectangle";
  img?: string;
  /** 0-100 */
  zoom?: number;
  defaultZoom?: number;
  /** w/h */
  aspectRatio?: number;
  imageRestriction?: "fit" | "none";
  minWidth?: number;
  minHeight?: number;
}>(), {
  type: "rectangle",
  img: Background,
  defaultZoom: 50,
  aspectRatio: 1,
  imageRestriction: "fit",
});

const controlledZoom = defineModel<number>("zoom");
const uncontrolledZoom = ref(props.defaultZoom);

const zoom = useMergedState(controlledZoom, uncontrolledZoom);

const stencilProps = computed(() => ({
  // lines: {},
  handlers: {},
  movable: false,
  resizable: false,
  scalable: false,
  aspectRatio: props.aspectRatio,
}));

const resizeImage = ref({
  touch: true,
  wheel: {
    ratio: 0.1,
  } as { ratio: number } | false,
  adjustStencil: false,
});

function stencilSize({ boundaries }: { boundaries: { width: number;height: number } }) {
  const { width, height } = boundaries;
  return {
    width,
    height,
  };
}

const cropperWrapperRef = ref<HTMLDivElement>();
const cropperRef = ref<InstanceType<typeof Cropper>>();
useResizeObserver(cropperWrapperRef, (entries) => {
  if (entries[0]) {
    requestAnimationFrame(refresh);
  }
});

function refresh() {
  cropperRef.value?.refresh();
}

function onCropperChange(e: any) {
  if (!cropperRef.value) {
    return;
  }
  const imageSize = e.image as { width: number | null; height: number | null };
  if (!imageSize.width || !imageSize.height) {
    return;
  }
  const coordinates = e.coordinates as { left: number; top: number; width: number; height: number };
  const sizeRestrictions = cropperRef.value.sizeRestrictions as { maxHeight: number;maxWidth: number;minHeight: number;minWidth: number };
  let _zoom: number;
  if (imageSize.width / imageSize.height > coordinates.width / coordinates.height) {
    _zoom = (imageSize.height - coordinates.height) / (imageSize.height - sizeRestrictions.minHeight);
  } else {
    _zoom = (imageSize.width - coordinates.width) / (imageSize.width - sizeRestrictions.minWidth);
  }
  zoom.value = _zoom * 100;
}

function minus() {
  handleZoom((zoom.value - 10) / 100, zoom.value / 100);
}

function plus() {
  handleZoom((zoom.value + 10) / 100, zoom.value / 100);
}

function onZoom(_zoom: number) {
  handleZoom(_zoom / 100, zoom.value / 100);
}

function handleZoom(zoom: number, oldZoom: number) {
  if (!cropperRef.value) {
    return;
  }
  const imageSize = cropperRef.value.imageSize as { width: number | null; height: number | null };
  if (!imageSize.height || !imageSize.width) {
    return;
  }
  const sizeRestrictions = cropperRef.value.sizeRestrictions as { maxHeight: number;maxWidth: number;minHeight: number;minWidth: number };
  if (imageSize.height < imageSize.width) {
    const minHeight = sizeRestrictions.minHeight;
    const imageHeight = imageSize.height;
    cropperRef.value.zoom((imageHeight - oldZoom * (imageHeight - minHeight)) / (imageHeight - zoom * (imageHeight - minHeight)) || 0);
  } else {
    const minWidth = sizeRestrictions.minWidth;
    const imageWidth = imageSize.width;
    cropperRef.value.zoom((imageWidth - oldZoom * (imageWidth - minWidth)) / (imageWidth - zoom * (imageWidth - minWidth)) || 0);
  }
}
</script>

<template>
  <div class="flex flex-col gap-8">
    <div ref="cropperWrapperRef">
      <Cropper ref="cropperRef" :min-width :min-height :transitions="false" :debounce="false" :src="img" :stencil-props :canvas="false" :stencil-size :image-restriction="imageRestriction === 'fit' ? 'stencil' : 'none'" :resize-image :stencil-component="type === 'rectangle' ? RectangleStencil : CircleStencil" @change="onCropperChange" />
    </div>
    <div class="flex items-center gap-4">
      <div class="i-uil-search-minus shrink-0 cursor-pointer text-lg transition hover:text-primary" @click="minus"></div>
      <NSlider :value="zoom" :tooltip="false" @update:value="onZoom" />
      <div class="i-uil-search-plus shrink-0 cursor-pointer text-2xl transition hover:text-primary" @click="plus"></div>
    </div>
  </div>
</template>
