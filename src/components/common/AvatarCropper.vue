<script setup lang="ts">
import { CircleStencil, Cropper } from "vue-advanced-cropper";

const { url } = defineProps<{ url?: string }>();

const emit = defineEmits<{
  change: [e: any];
}>();

function defaultSize({ imageSize }: { imageSize?: { width: number;height: number } }) {
  return {
    width: imageSize?.width,
    height: imageSize?.height,
  };
}

const stencilProps = ref({
  aspectRatio: 1,
});

const resizeImage = ref({
  touch: true,
  wheel: {
    ratio: 0.1,
  },
  adjustStencil: false,
});

const cropperRef = ref<InstanceType<typeof Cropper>>();
defineExpose({
  cropperRef,
});
</script>

<template>
  <Cropper ref="cropperRef" :debounce="false" :transitions="false" :default-size :resize-image :stencil-props priority="visible-area" image-restriction="fit-area" :stencil-component="CircleStencil" :src="url" @change="e => emit('change', e)" />
</template>
