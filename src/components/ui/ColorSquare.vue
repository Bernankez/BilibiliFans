<template>
  <div class="color-square w-4 h-4 rounded-1" @click="onClick"></div>
</template>

<script setup lang="ts">
const { color = "#ffffff", disabled = false } = defineProps<{
  color?: string;
  disabled?: boolean;
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
}
</style>
