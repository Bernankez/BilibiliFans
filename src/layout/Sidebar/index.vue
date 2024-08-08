<script setup lang="ts">
import { breakpointsTailwind } from "@vueuse/core";
import SidebarPanel from "./SidebarPanel.vue";
import ActionPanel from "./ActionPanel.vue";

const sidebarStore = useSidebarStore();
const { show } = storeToRefs(sidebarStore);

const { sm } = useBreakpoints(breakpointsTailwind);
</script>

<template>
  <aside v-if="!sm" class="flex shrink-0 transition-all">
    <SidebarPanel class="fixed bottom-0 right-[var(--actions-width)] top-0 transition-all" :class="[show ? 'w-[calc(100%_-_var(--actions-width))]' : 'w-0']" />
    <ActionPanel />
  </aside>
  <aside v-else class="w-[calc(var(--sidebar-width)_+_var(--actions-width))] flex shrink-0 transition-all" :class="[show ? 'max-w-[calc(var(--sidebar-width)_+_var(--actions-width))]' : 'max-w-[var(--actions-width)]']">
    <SidebarPanel class="w-full" />
    <ActionPanel />
  </aside>
</template>
