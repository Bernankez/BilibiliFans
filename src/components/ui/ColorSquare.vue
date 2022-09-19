<template>
  <div class="color-square w-4 h-4 rounded-1 b-1" @click="onClick"></div>
</template>

<script setup lang="ts">
import { colorDisabled } from "@/style/theme";

const {
  color = "#ffffff",
  disabled = false,
  borderColor = colorDisabled.DEFAULT,
} = defineProps<{
  color?: string;
  disabled?: boolean;
  borderColor?: string;
}>();

const emit = defineEmits<{
  (event: "click", color: string): void;
}>();

const onClick = () => {
  if (!disabled) {
    emit("click", color);
  }
};

const cursor = $computed(() => (disabled ? "not-allowed" : "pointer"));
</script>

<style lang="scss" scoped>
.color-square {
  background-color: v-bind("color");
  cursor: v-bind("cursor");
  border-color: v-bind("borderColor");
}
</style>
