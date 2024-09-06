<script setup lang="ts">
const {
  color = "#ffffff",
} = defineProps<{
  color?: string;
}>();

const emit = defineEmits<{
  click: [color: string];
}>();

function onClick() {
  emit("click", color);
}
</script>

<template>
  <NTooltip>
    <template #trigger>
      <div class="h-4 w-4 cursor-pointer b-1 b-border rounded b-solid" :style="{ backgroundColor: color }" @click="onClick"></div>
    </template>
    {{ color }}
  </NTooltip>
</template>
