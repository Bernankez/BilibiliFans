<script setup lang="ts">
import type { TemplateManifest } from "@/types/template";

defineProps<{
  nickname: string;
  template: TemplateManifest<Blob | string>;
}>();
</script>

<template>
  <FansCard :nickname="nickname" :color="template.cardStyle.color" :background="template.cardStyle.background" :foreground="template.cardStyle.foreground" />
</template>
