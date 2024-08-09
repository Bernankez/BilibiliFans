<script setup lang="ts">
import { breakpointsTailwind } from "@vueuse/core";
import SidebarPanel from "./SidebarPanel.vue";
import ActionPanel from "./ActionPanel.vue";

const sidebarStore = useSidebarStore();
const { show } = storeToRefs(sidebarStore);

const { sm } = useBreakpoints(breakpointsTailwind);
</script>

<template>
  <aside v-if="!sm" class="flex shrink-0">
    <div class="fixed bottom-0 right-[var(--actions-width)] top-0 overflow-hidden transition-max-width" :class="[show ? 'max-w-[calc(100%_-_var(--actions-width))]' : 'max-w-0']">
      <SidebarPanel class="h-full w-[calc(100vw_-_var(--actions-width))]" />
    </div>
    <ActionPanel />
  </aside>
  <aside v-else class="flex shrink-0">
    <div class="overflow-hidden transition-max-width" :class="[show ? 'max-w-[var(--sidebar-width)]' : 'max-w-0']">
      <SidebarPanel class="h-full w-[var(--sidebar-width)]" />
    </div>
    <ActionPanel />
  </aside>
</template>
