<template>
  <NModal v-model:show="show" :style="wrapperStyle" role="dialog" aria-modal="true">
    <div class="dialog--wrapper">
      <div class="flex justify-between items-center p-y-4 p-x-5 box-border text-5">
        <div>
          <slot name="title">{{ title }}</slot>
        </div>
        <div
          role="button"
          class="transition duration-230 hover:bg-backgray active:bg-backgraydarker hover:cursor-pointer rounded-1">
          <div class="i-uil:times text-6 text-secondary"></div>
        </div>
      </div>
      <div class="p-x-5 p-b-4 box-border">
        <slot></slot>
      </div>
      <div class="p-x-5 p-b-4 box-border">
        <slot name="footer">
          <NSpace justify="end">
            <NButton secondary>{{ cancelText }}</NButton>
            <NButton type="primary">{{ confirmText }}</NButton>
          </NSpace>
        </slot>
      </div>
    </div>
  </NModal>
</template>

<script setup lang="ts">
import { NModal, NButton, NSpace } from "naive-ui";

const {
  modelValue = false,
  width = "90%",
  maxWidth = "600px",
  title = "",
  confirmText = "确定",
  cancelText = "取消",
} = defineProps<{
  modelValue?: boolean;
  width?: string;
  maxWidth?: string;
  title?: string;
  confirmText?: string;
  cancelText?: string;
}>();

const wrapperStyle = $computed(() => ({
  "--width": width,
  "--max-width": maxWidth,
}));

const emit = defineEmits<{
  (event: "update:modelValue", show: boolean): void;
}>();

const show = $computed({
  get() {
    return modelValue;
  },
  set(s: boolean) {
    emit("update:modelValue", s);
  },
});
</script>

<style lang="scss" scoped>
.dialog--wrapper {
  @apply bg-white rounded-1 text-default;
  width: var(--width);
  max-width: var(--max-width);
}
</style>
