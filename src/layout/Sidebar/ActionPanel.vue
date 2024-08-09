<script setup lang="ts">
import Action from "./Action.vue";
import type { Actions } from "@/store/sidebar";

const { t } = useI18n();

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
    <Action id="copywriting" :tooltip="t('sidebar.actions.sharingCopywriting')" icon="i-uil-text-fields" @click="active" />
    <Action id="styles" :tooltip="t('sidebar.actions.cardStyles')" icon="i-uil-postcard" @click="active" />
  </div>
</template>
