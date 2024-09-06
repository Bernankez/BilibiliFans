<script setup lang="ts">
import { formItemProps } from "naive-ui";

defineProps(formItemProps);
</script>

<template>
  <NFormItem v-bind="$attrs" :show-label="false">
    <div class="w-full flex flex-col">
      <div v-if="$slots.label || label" class="n-form-item-label cursor-default items-center!">
        <slot name="label">
          {{ label }}
        </slot>
      </div>
      <div v-if="$slots.default">
        <slot></slot>
      </div>
    </div>
  </NFormItem>
</template>

<style scoped>
.n-form-item-label {
  grid-area: label;
}
</style>
