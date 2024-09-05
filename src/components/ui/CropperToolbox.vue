<script setup lang="ts">
const emit = defineEmits<{
  minus: [];
  plus: [];
  move: [direction: "up" | "down" | "left" | "right"];
}>();

const zoom = defineModel("zoom", {
  default: 0,
});

const { t } = useI18n();
</script>

<template>
  <div class="flex flex-col gap-2">
    <div class="flex items-center gap-4">
      <div class="i-uil-search-minus shrink-0 cursor-pointer text-lg transition hover:text-primary" @click="emit('minus')"></div>
      <NSlider v-model:value="zoom" :tooltip="false" />
      <div class="i-uil-search-plus shrink-0 cursor-pointer text-2xl transition hover:text-primary" @click="emit('plus')"></div>
    </div>
    <div class="flex items-center justify-center gap-4">
      <NTooltip :keep-alive-on-hover="false" :duration="0">
        <template #trigger>
          <Button icon="i-uil-arrow-up" @click="emit('move', 'up')" />
        </template>
        <span>{{ t("cropper.toolbox.up") }}</span>
      </NTooltip>
      <NTooltip :keep-alive-on-hover="false" :duration="0">
        <template #trigger>
          <Button icon="i-uil-arrow-down" @click="emit('move', 'down')" />
        </template>
        <span>{{ t("cropper.toolbox.down") }}</span>
      </NTooltip>
      <NTooltip :keep-alive-on-hover="false" :duration="0">
        <template #trigger>
          <Button icon="i-uil-arrow-left" @click="emit('move', 'left')" />
        </template>
        <span>{{ t("cropper.toolbox.left") }}</span>
      </NTooltip>
      <NTooltip :keep-alive-on-hover="false" :duration="0">
        <template #trigger>
          <Button icon="i-uil-arrow-right" @click="emit('move', 'right')" />
        </template>
        <span>{{ t("cropper.toolbox.right") }}</span>
      </NTooltip>
    </div>
  </div>
</template>
