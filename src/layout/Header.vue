<script setup lang="ts">
const { t } = useI18n();
</script>

<template>
  <header class="h-[var(--header-height)] flex items-center justify-between overflow-hidden b-b-1 b-border b-solid p-2">
    <div>
      <Button>
        <div class="flex items-center gap-2">
          <div class="i-fluent-emoji-magic-wand text-4xl"></div>
          <span class="hidden text-xl font-bold font-mono md:inline">BilibiliFans</span>
        </div>
      </Button>
    </div>
    <div class="flex items-center gap-3">
      <ResponsiveButton secondary type="primary" :tooltip="t('app.interface.new')">
        <template #icon>
          <div class="i-uil-plus-square"></div>
        </template>
        {{ t("app.interface.new") }}
      </ResponsiveButton>
      <ResponsiveButton placement="bottom-end" type="primary" :tooltip="t('app.interface.generate')">
        <template #icon>
          <div class="i-fluent-emoji-flat-sparkles"></div>
        </template>
        {{ t("app.interface.generate") }}
      </ResponsiveButton>
    </div>
  </header>
</template>
