<script setup lang="ts">
const appStore = useAppStore();
const { showSideBar } = storeToRefs(appStore);
</script>

<template>
  <header class="h-[var(--header-height)] flex items-center justify-between p-2 shadow">
    <div></div>
    <div>
      <NButton text class="text-3xl" @click="showSideBar = !showSideBar">
        <div :class="[showSideBar ? 'i-uil-left-indent' : 'i-uil-align']"></div>
      </NButton>
    </div>
  </header>
</template>
