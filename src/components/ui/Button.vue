<script setup lang="ts">
import { breakpointsTailwind } from "@vueuse/core";

const props = withDefaults(defineProps<{
  icon?: any;
  title?: string;
  href?: string;
  target?: string;
  disabled?: boolean;
  autoCollapse?: boolean;
  collapsePoint?: "sm" | "md" | "lg" | "xl" | "2xl";
}>(), {
  target: "_blank",
  autoCollapse: true,
  collapsePoint: "sm",
});

const emit = defineEmits<{
  click: [e: MouseEvent];
}>();

const as = computed(() => props.href ? "a" : "div");
const linkProps = computed(() => as.value === "a" ? ({ href: props.href, target: props.target }) : ({}));

function onClick(e: MouseEvent) {
  if (props.disabled) {
    return;
  }
  emit("click", e);
}

const breakpoints = useBreakpoints(breakpointsTailwind);

const showSlot = computed(() => {
  return breakpoints[props.collapsePoint].value || !props.autoCollapse || !props.icon;
});
</script>

<template>
  <component :is="as" tabindex="0" title v-bind="linkProps" class="flex cursor-pointer select-none items-center gap-1.5 rounded-lg p-1.5 transition focus:bg-accent hover:bg-accent hover:text-primary" @click="onClick">
    <div v-if="icon && typeof icon !== 'function'" class="text-2xl" :class="[icon]"></div>
    <template v-if="typeof icon === 'function'">
      <component :is="icon" class="text-2xl" />
    </template>
    <slot v-if="showSlot"></slot>
  </component>
</template>
