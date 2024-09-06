<script setup lang="ts">
import type { Actions } from "@/store/sidebar";

const sidebarStore = useSidebarStore();
const { show, activeAction } = storeToRefs(sidebarStore);

const Template = defineAsyncComponent(() => import("./Template.vue"));
const Copywriting = defineAsyncComponent(() => import("./Copywriting.vue"));
const Card = defineAsyncComponent(() => import("./Card.vue"));
const User = defineAsyncComponent(() => import("./User.vue"));
const Setting = defineAsyncComponent(() => import("./Setting.vue"));

function asyncPanel(key?: Actions) {
  switch (key) {
    case "template":
      return Template;
    case "copywriting":
      return Copywriting;
    case "card":
      return Card;
    case "user":
      return User;
    case "setting":
      return Setting;
  }
}
</script>

<template>
  <div class="box-border overflow-auto b-border b-solid bg-background p-4" :class="[show ? 'b-l-1' : '']">
    <KeepAlive>
      <component :is="asyncPanel(activeAction)" />
    </KeepAlive>
  </div>
</template>
