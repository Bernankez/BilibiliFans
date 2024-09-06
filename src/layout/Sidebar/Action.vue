<script setup lang="ts" generic="T extends Actions">
import type { Actions } from "@/store/sidebar";

const props = defineProps<{
  id?: T;
  icon: string;
  tooltip?: string;
}>();

const emit = defineEmits<{
  click: [e: MouseEvent, id?: T];
}>();

const sidebarStore = useSidebarStore();
const { show, activeAction } = storeToRefs(sidebarStore);

const [DefineTemplate, ReuseTemplate] = createReusableTemplate();
</script>

<template>
  <DefineTemplate>
    <div v-bind="$attrs" class="flex cursor-pointer items-center justify-center p-3 text-foreground transition hover:text-primary" :class="[(show && activeAction === props.id) ? 'text-primary' : '']" @click="e => emit('click', e, props.id)">
      <div class="text-2xl" :class="[icon]"></div>
    </div>
  </DefineTemplate>
  <NTooltip v-if="tooltip" placement="left" :delay="1000" :keep-alive-on-hover="false" :duration="0">
    <template #trigger>
      <ReuseTemplate />
    </template>
    {{ tooltip }}
  </NTooltip>
  <ReuseTemplate v-else />
</template>
