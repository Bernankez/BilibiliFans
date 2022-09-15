<template>
  <div>
    <div class="text-5">{{ title }}</div>
    <slot></slot>
  </div>
</template>

<script setup lang="ts">
const { title = "" } = defineProps<{
  title?: string;
}>();
</script>
