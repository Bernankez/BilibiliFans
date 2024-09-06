<script setup lang="ts">
import type { TemplateManifest } from "@/types/template";

defineProps<{
  template: TemplateManifest<Blob | string>;
}>();

const emit = defineEmits<{
  click: [template: TemplateManifest<Blob | string>];
}>();

const userStore = useUserStore();
const { nickname, avatar } = storeToRefs(userStore);
</script>

<template>
  <div class="w-90 flex flex-col cursor-pointer gap-2 rounded-md p-3 transition hover:bg-muted" @click="emit('click', template)">
    <DemoFansCard :template="template" :nickname :avatar />
    <div class="flex select-none justify-center">
      {{ template.name }}
    </div>
  </div>
</template>
