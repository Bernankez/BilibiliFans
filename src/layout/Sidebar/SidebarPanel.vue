<script setup lang="ts">
import type { Actions } from "@/store/sidebar";

const sidebarStore = useSidebarStore();
const { show, activeAction } = storeToRefs(sidebarStore);

function asyncPanel(key?: Actions) {
  switch (key) {
    case "template":
      return defineAsyncComponent(() => import("./Template.vue"));
    case "copywriting":
      return defineAsyncComponent(() => import("./Copywriting.vue"));
    case "card":
      return defineAsyncComponent(() => import("./Card.vue"));
    case "user":
      return defineAsyncComponent(() => import("./User.vue"));
    case "setting":
      return defineAsyncComponent(() => import("./Setting.vue"));
  }
}
</script>

<template>
  <div class="box-border overflow-auto b-border b-solid bg-background p-4" :class="[show ? 'b-l-1' : '']">
    <component :is="asyncPanel(activeAction)" />
  </div>
</template>
