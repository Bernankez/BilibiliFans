<template>
  <NModal
    v-model:show="show"
    :style="wrapperStyle"
    role="dialog"
    aria-modal="true"
    :maskClosable="closeOnOverlay"
    :closeOnEsc="closeOnEsc"
    :displayDirective="displayDirective">
    <div class="dialog--wrapper">
      <div class="flex justify-between items-center p-y-4 p-x-5 box-border text-5">
        <div class="text-default dark:text-darkdefault cursor-default">
          <slot name="title">{{ title }}</slot>
        </div>
        <div
          role="button"
          class="transition duration-230 hover:bg-background-light hover:dark:bg-darkbackground-lighter active:bg-background! active:dark:bg-darkbackground-light! hover:cursor-pointer rounded-1">
          <div class="i-uil:times text-6 text-default-light dark:text-darkdefault" @click="onCancel"></div>
        </div>
      </div>
      <div class="p-x-5 p-b-4 box-border">
        <slot></slot>
      </div>
      <div v-if="useFooter" class="p-x-5 p-b-4 box-border">
        <slot name="footer">
          <NSpace justify="end">
            <NButton secondary @click="onCancel">{{ cancelText }}</NButton>
            <NButton type="primary" @click="emit('confirm')">{{ confirmText }}</NButton>
          </NSpace>
        </slot>
      </div>
    </div>
  </NModal>
</template>

<script setup lang="ts">
import { colorPrimary } from "@/style/theme";
import { NButton, NModal, NSpace } from "naive-ui";

const {
  modelValue = false,
  width = "90%",
  maxWidth = "600px",
  title = "",
  confirmText = "确定",
  cancelText = "取消",
  closeOnOverlay = true,
  closeOnEsc = true,
  displayDirective = "if",
  useFooter = true,
} = defineProps<{
  modelValue?: boolean;
  width?: string;
  maxWidth?: string;
  title?: string;
  confirmText?: string;
  cancelText?: string;
  closeOnOverlay?: boolean;
  closeOnEsc?: boolean;
  displayDirective?: "if" | "show";
  useFooter?: boolean;
}>();

// style v-bind does not work in teleport
// #ref: https://github.com/vuejs/core/issues/4605
const wrapperStyle = $computed(() => ({
  "--width": width,
  "--max-width": maxWidth,
  "--selection-background": colorPrimary.DEFAULT,
}));

const emit = defineEmits<{
  (event: "update:modelValue", show: boolean): void;
  (event: "confirm"): void;
  (event: "cancel"): void;
}>();

const show = $computed({
  get() {
    return modelValue;
  },
  set(s: boolean) {
    emit("update:modelValue", s);
  },
});

const onCancel = () => {
  emit("update:modelValue", false);
  emit("cancel");
};
</script>

<style lang="scss" scoped>
.dialog--wrapper {
  @apply bg-background-lighter dark-bg-darkbackground rounded-1 text-default transition-all duration-250;
  width: var(--width);
  max-width: var(--max-width);

  ::selection {
    background-color: var(--selection-background);
    color: #fff;
  }
}
</style>
