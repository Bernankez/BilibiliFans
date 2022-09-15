<template>
  <div class="text-4">
    <div class="font-bold text-6">{{ title }}</div>
    <slot></slot>
  </div>
</template>

<script setup lang="ts">
const { title = "" } = defineProps<{
  title?: string;
}>();
</script>
