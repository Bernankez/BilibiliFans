<script setup lang="ts">
const appStore = useAppStore();
const { showSideBar } = storeToRefs(appStore);

const maxWidth = computed(() => showSideBar.value ? "var(--side-bar-width)" : "0");
</script>

<template>
  <aside class="w-[var(--side-bar-width)] bg-gray transition-all" :style="{ maxWidth }">
    testing
  </aside>
</template>
