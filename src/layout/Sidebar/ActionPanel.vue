<script setup lang="ts">
import type { Actions } from "@/store/sidebar";
import Action from "./Action.vue";

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

function isSelfShow(id: Actions) {
  return show.value && activeAction.value === id;
}
</script>

<template>
  <div class="w-[var(--actions-width)] shrink-0 b-l-1 b-border b-solid">
    <Action id="user" :tooltip="isSelfShow('user') ? undefined : t('action.user.title')" icon="i-uil-user" @click="active" />
    <Action id="copywriting" :tooltip="isSelfShow('copywriting') ? undefined : t('action.copywriting.title')" icon="i-uil-text-fields" @click="active" />
    <Action id="card" :tooltip="isSelfShow('card') ? undefined : t('action.card.title')" icon="i-uil-palette" @click="active" />
    <Action id="template" :tooltip="isSelfShow('template') ? undefined : t('action.template.title')" icon="i-uil-postcard" @click="active" />
    <Action id="setting" :tooltip="isSelfShow('setting') ? undefined : t('action.setting.title')" icon="i-uil-setting" @click="active" />
  </div>
</template>
