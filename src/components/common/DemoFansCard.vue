<script setup lang="ts">
import type { TemplateManifest } from "@/types/template";

defineProps<{
  nickname?: string;
  avatar?: string;
  template: TemplateManifest<Blob | string>;
}>();
</script>

<template>
  <FansCard :nickname :avatar :color="template.cardStyle.color" :date="template.copywriting.date" :background="template.cardStyle.background" :foreground="template.cardStyle.foreground" />
</template>
