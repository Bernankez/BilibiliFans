<script setup lang="ts">
import Header from "./Header.vue";
import Sidebar from "./SideBar.vue";
import Activitybar from "./ActivityBar.vue";

const appStore = useAppStore();
const { rightSize } = storeToRefs(appStore);
</script>

<template>
  <div class="h-full w-full flex">
    <div class="w-full pt-[var(--header-height)]">
      <Header class="fixed left-0 top-0 transition-all" :style="{ right: rightSize }" />
      <main class="h-full w-full">
        <slot></slot>
      </main>
    </div>
    <Sidebar class="h-full shrink-0" />
    <Activitybar class="shrink-0" />
  </div>
</template>
