<script setup lang="ts">
import { checkVisibility } from "@/utils/dom";
import { CircleStencil, Cropper, RectangleStencil } from "vue-advanced-cropper";
import "vue-advanced-cropper/dist/style.css";

const props = withDefaults(defineProps<{
  origin?: [number, number];
  size?: [number, number];
  type?: "circle" | "rectangle";
  img?: string | Blob;
  defaultZoom?: number;
  /** w/h */
  aspectRatio?: number;
  minWidth?: number;
  minHeight?: number;
  defaultImageRestriction?: "fit" | "none";
}>(), {
  type: "rectangle",
  defaultZoom: 50,
  aspectRatio: 1,
  defaultImageRestriction: "fit",
});

const emit = defineEmits<{
  change: [origin: [number, number], size: [number, number]];
}>();

const { t } = useI18n();

const controlledZoom = defineModel<number>("zoom");
const uncontrolledZoom = ref(props.defaultZoom);

const zoom = useMergedState(controlledZoom, uncontrolledZoom);

const defaultSize = computed(() => {
  if (!props.size) {
    return undefined;
  }
  return {
    width: props.size[0],
    height: props.size[1],
  };
});

const defaultPosition = computed(() => {
  if (!props.origin) {
    return undefined;
  }
  return {
    left: props.origin[0],
    top: props.origin[1],
  };
});

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
  if (!cropperWrapperRef.value || !checkVisibility(cropperWrapperRef.value)) {
    return;
  }
  cropperRef.value?.refresh();
}

let onReadyFn: (() => void) | undefined;
const stop = watchEffect(() => {
  if (defaultPosition.value && defaultSize.value && cropperRef.value) {
    nextTick(() => stop());
    const cropper = cropperRef.value;
    const position = defaultPosition.value;
    const size = defaultSize.value;
    onReadyFn = () => {
      cropper.setCoordinates({
        left: position.left,
        top: position.top,
        width: size.width,
        height: size.height,
      });
    };
  }
});

function onCropperReady() {
  if (!cropperRef.value || !checkVisibility(cropperRef.value.$el)) {
    return;
  }
  onReadyFn?.();
  onReadyFn = undefined;
}

function onCropperChange() {
  if (!cropperRef.value) {
    return;
  }
  const e = cropperRef.value.getResult();
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
  if (coordinates.width && coordinates.height) {
    emit("change", [Math.round(coordinates.left), Math.round(coordinates.top)], [Math.round(coordinates.width), Math.round(coordinates.height)]);
  }
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

function handleMove(direction: "up" | "down" | "left" | "right") {
  if (!cropperRef.value) {
    return;
  }
  const imageSize = cropperRef.value.imageSize as { width: number | null; height: number | null };
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
      cropperRef.value.move(0, -offset);
      break;
    case "down":
      cropperRef.value.move(0, offset);
      break;
    case "left":
      cropperRef.value.move(-offset, 0);
      break;
    case "right":
      cropperRef.value.move(offset, 0);
      break;
  }
}

const { url } = useBlobUrl(() => props.img);

const controlledImageRestriction = defineModel<"fit" | "none">("imageRestriction", {
  required: false,
});
const uncontrolledImageRestriction = ref(props.defaultImageRestriction);
const imageRestriction = useMergedState(controlledImageRestriction, uncontrolledImageRestriction);
</script>

<template>
  <div ref="cropperWrapperRef" class="flex flex-col gap-8">
    <Cropper ref="cropperRef" :default-size :default-position class="h-0 flex-1 shadow-lg" priority="visible-area" :min-width :min-height :transitions="false" :debounce="false" :src="url" :stencil-props :canvas="false" :stencil-size :image-restriction="imageRestriction === 'fit' ? 'stencil' : 'none'" :resize-image :stencil-component="type === 'rectangle' ? RectangleStencil : CircleStencil" @change="onCropperChange" @ready="onCropperReady" />
    <div class="flex flex-col gap-2">
      <CropperToolbox :zoom @update:zoom="onZoom" @minus="minus" @plus="plus" @move="handleMove" />
      <div class="flex items-center justify-center">
        <NCheckbox :checked="imageRestriction === 'fit'" @update:checked="v => imageRestriction = v ? 'fit' : 'none'">
          {{ t('cropper.restrictImage') }}
        </NCheckbox>
      </div>
    </div>
  </div>
</template>
