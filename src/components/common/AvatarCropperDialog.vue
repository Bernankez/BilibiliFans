<script setup lang="ts">
import AvatarCropper from "./AvatarCropper.vue";

const { url, defaultZoom = 50 } = defineProps<{
  url?: string;
  defaultZoom?: number;
}>();

const emit = defineEmits<{
  confirm: [canvas?: HTMLCanvasElement];
  cancel: [];
}>();

const { t } = useI18n();

const controlledZoom = defineModel<number>("zoom");
const uncontrolledZoom = ref(defaultZoom);

const zoom = useMergedState(controlledZoom, uncontrolledZoom);

const show = defineModel("show", {
  default: false,
});

const cropperRef = ref<InstanceType<typeof AvatarCropper>>();

function onCropperChange() {
  if (!cropperRef.value?.cropperRef) {
    return;
  }
  const e = cropperRef.value.cropperRef.getResult();
  const imageSize = e.image as { width: number | null; height: number | null };
  if (!imageSize.width || !imageSize.height) {
    return;
  }
  const coordinates = e.coordinates as { left: number; top: number; width: number; height: number };
  const sizeRestrictions = cropperRef.value.cropperRef.sizeRestrictions as { maxHeight: number;maxWidth: number;minHeight: number;minWidth: number };
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
  if (!cropperRef.value?.cropperRef) {
    return;
  }
  const imageSize = cropperRef.value.cropperRef.imageSize as { width: number | null; height: number | null };
  if (!imageSize.height || !imageSize.width) {
    return;
  }
  const sizeRestrictions = cropperRef.value.cropperRef.sizeRestrictions as { maxHeight: number;maxWidth: number;minHeight: number;minWidth: number };
  if (imageSize.height < imageSize.width) {
    const minHeight = sizeRestrictions.minHeight;
    const imageHeight = imageSize.height;
    cropperRef.value.cropperRef.zoom((imageHeight - oldZoom * (imageHeight - minHeight)) / (imageHeight - zoom * (imageHeight - minHeight)) || 0);
  } else {
    const minWidth = sizeRestrictions.minWidth;
    const imageWidth = imageSize.width;
    cropperRef.value.cropperRef.zoom((imageWidth - oldZoom * (imageWidth - minWidth)) / (imageWidth - zoom * (imageWidth - minWidth)) || 0);
  }
}

function handleMove(direction: "up" | "down" | "left" | "right") {
  if (!cropperRef.value?.cropperRef) {
    return;
  }
  const imageSize = cropperRef.value.cropperRef.imageSize as { width: number | null; height: number | null };
  if (!imageSize.height || !imageSize.width) {
    return;
  }
  let offset: number;
  if (direction === "up" || direction === "down") {
    offset = imageSize.height / 10;
  } else {
    offset = imageSize.width / 10;
  }
  switch (direction) {
    case "up":
      cropperRef.value.cropperRef.move(0, -offset);
      break;
    case "down":
      cropperRef.value.cropperRef.move(0, offset);
      break;
    case "left":
      cropperRef.value.cropperRef.move(-offset, 0);
      break;
    case "right":
      cropperRef.value.cropperRef.move(offset, 0);
      break;
  }
}

function cancel() {
  emit("cancel");
}

function confirm() {
  const canvas = cropperRef.value?.cropperRef?.getResult().canvas;
  emit("confirm", canvas);
}
</script>

<template>
  <NModal v-model:show="show" class="h-screen" :title="t('action.user.avatar.cropDialog.title')" preset="card">
    <div class="h-0 flex flex-1 flex-col gap-4">
      <AvatarCropper ref="cropperRef" class="h-0 flex-1" :url @change="onCropperChange" />
      <CropperToolbox :zoom @update:zoom="onZoom" @minus="minus" @plus="plus" @move="handleMove" />
    </div>
    <template #footer>
      <div class="flex justify-end gap-4" @click="cancel">
        <NButton>{{ t('action.user.avatar.cropDialog.cancel') }}</NButton>
        <NButton type="primary" @click="confirm">
          {{ t('action.user.avatar.cropDialog.confirm') }}
        </NButton>
      </div>
    </template>
  </NModal>
</template>

<style scoped>
:global(.n-card .n-card__content) {
  display: flex;
  flex-direction: column;
  height: 0;
}
</style>
