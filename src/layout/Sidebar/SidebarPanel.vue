<script setup lang="ts">
import type { Actions } from "@/store/sidebar";

const sidebarStore = useSidebarStore();
const { show, activeAction } = storeToRefs(sidebarStore);

function asyncPanel(key?: Actions) {
  switch (key) {
    case "copywriting":
      return defineAsyncComponent(() => import("./Copywriting.vue"));
    case "styles":
      return defineAsyncComponent(() => import("./Styles.vue"));
  }
}
</script>

<template>
  <div class="box-border b-border b-solid bg-background p-4" :class="[show ? 'b-l-1' : '']">
    <component :is="asyncPanel(activeAction)" />
  </div>
</template>
