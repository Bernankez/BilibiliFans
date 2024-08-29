<script setup lang="ts">
import type { TemplateManifest } from "@/types/template";

defineProps<{
  template: TemplateManifest<Blob | string>;
}>();

const emit = defineEmits<{
  click: [template: TemplateManifest<Blob | string>];
}>();
</script>

<template>
  <div class="w-90 flex flex-col cursor-pointer gap-2 rounded-md p-3 transition hover:bg-muted" @click="emit('click', template)">
    <DemoFansCard :template="template" nickname="科科Cole" />
    <div class="flex select-none justify-center">
      {{ template.name }}
    </div>
  </div>
</template>
