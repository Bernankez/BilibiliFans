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

function minus() {
  zoom.value -= 10;
}

function plus() {
  zoom.value += 10;
}

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
  },
  adjustStencil: false,
});

function stencilSize({ boundaries }: { boundaries: { width: number;height: number } }) {
  const { width, height } = boundaries;
  return {
    width,
    height,
  };
}
</script>

<template>
  <div class="flex flex-col gap-8">
    <div>
      <Cropper :debounce="0" :src="img" :stencil-props :canvas="false" :stencil-size :image-restriction="imageRestriction === 'fit' ? 'stencil' : 'none'" :resize-image :stencil-component="type === 'rectangle' ? RectangleStencil : CircleStencil" />
    </div>
    <div class="flex items-center gap-4">
      <div class="i-uil-search-minus shrink-0 cursor-pointer text-lg transition hover:text-primary" @click="minus"></div>
      <NSlider v-model:value="zoom" :tooltip="false" />
      <div class="i-uil-search-plus shrink-0 cursor-pointer text-2xl transition hover:text-primary" @click="plus"></div>
    </div>
  </div>
</template>
