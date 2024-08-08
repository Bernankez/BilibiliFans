<script setup lang="ts">
import Action from "./Action.vue";

const sidebarStore = useSidebarStore();
const { show } = storeToRefs(sidebarStore);
</script>

<template>
  <div class="w-[var(--actions-width)] shrink-0 b-l-1 b-border b-solid">
    <Action id="share" tooltip="分享文案" icon="i-uil-text-fields" @click="show = !show" />
    <Action id="card" tooltip="卡片样式" icon="i-uil-postcard" @click="show = !show" />
  </div>
</template>
