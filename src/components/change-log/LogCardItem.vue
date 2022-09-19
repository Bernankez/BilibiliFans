<template>
  <div>
    <div class="text-4 font-bold">{{ title }}</div>
    <slot></slot>
  </div>
</template>

<script setup lang="ts">
const { title = "" } = defineProps<{
  title?: string;
}>();
</script>
