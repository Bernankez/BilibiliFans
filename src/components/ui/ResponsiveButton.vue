<script setup lang="ts">
import { breakpointsTailwind } from "@vueuse/core";
import { buttonProps, tooltipProps } from "naive-ui";
import type { PropType } from "vue";

const props = defineProps({
  ...buttonProps,
  tooltip: {
    type: String,
    required: false,
  },
  breakpoint: {
    type: String as PropType<"sm" | "md" | "lg" | "xl" | "2xl">,
    default: "md",
    required: false,
  },
  placement: tooltipProps.placement,
});

const breakpoints = useBreakpoints(breakpointsTailwind);
</script>

<template>
  <div>
    <NTooltip v-if="!breakpoints[breakpoint].value" :placement>
      <template #trigger>
        <NButton v-bind="{ ...props, ...$attrs }">
          <template #icon>
            <slot name="icon"></slot>
          </template>
        </NButton>
      </template>
      {{ tooltip }}
    </NTooltip>
    <NButton v-else v-bind="{ ...props, ...$attrs }">
      <template #icon>
        <slot name="icon"></slot>
      </template>
      <slot></slot>
    </NButton>
  </div>
</template>
