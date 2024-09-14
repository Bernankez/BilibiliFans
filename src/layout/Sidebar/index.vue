<script setup lang="ts">
import { breakpointsTailwind } from "@vueuse/core";
import clsx from "clsx";
import ActionPanel from "./ActionPanel.vue";
import SidebarPanel from "./SidebarPanel.vue";

const sidebarStore = useSidebarStore();
const { show } = storeToRefs(sidebarStore);

const { sm } = useBreakpoints(breakpointsTailwind);

// @unocss-include
const divClass = computed(() => {
  if (!sm.value) {
    return clsx(["fixed bottom-0 right-[var(--actions-width)] top-0 overflow-hidden transition-max-width", show.value ? "max-w-[calc(100%_-_var(--actions-width))]" : "max-w-0"]);
  } else {
    return clsx(["overflow-hidden transition-max-width", show.value ? "max-w-[var(--sidebar-width)]" : "max-w-0"]);
  }
});

const sidebarPanelClass = computed(() => {
  if (!sm.value) {
    return "h-full w-[calc(100vw_-_var(--actions-width))]";
  } else {
    return "h-full w-[var(--sidebar-width)]";
  }
});
</script>

<template>
  <aside class="flex shrink-0">
    <div :class="divClass">
      <SidebarPanel :class="sidebarPanelClass" />
    </div>
    <ActionPanel />
  </aside>
</template>
