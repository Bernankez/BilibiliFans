<script setup lang="ts">
const sidebarStore = useSidebarStore();
const { show } = storeToRefs(sidebarStore);
</script>

<template>
  <div class="b-border b-solid bg-background" :class="[show ? 'b-l-1' : '']"></div>
</template>
