<script setup lang="ts">
import Action from "./Action.vue";
import type { Actions } from "@/store/sidebar";

const sidebarStore = useSidebarStore();
const { show, activeAction } = storeToRefs(sidebarStore);

function active(e: MouseEvent, id?: Actions) {
  if (id === activeAction.value) {
    show.value = !show.value;
  } else {
    activeAction.value = id;
    show.value = true;
  }
}
</script>

<template>
  <div class="w-[var(--actions-width)] shrink-0 b-l-1 b-border b-solid">
    <Action id="template" icon="i-uil-postcard" @click="active" />
    <Action id="copywriting" icon="i-uil-text-fields" @click="active" />
    <Action id="card" icon="i-uil-palette" @click="active" />
    <Action id="user" icon="i-uil-user" @click="active" />
  </div>
</template>
