<script setup lang="ts">
const { t } = useI18n();
</script>

<template>
  <header class="h-[var(--header-height)] flex items-center justify-between overflow-hidden b-b-1 b-border b-solid p-2">
    <div>
      <div class="i-fluent-emoji-sparkles text-4xl"></div>
    </div>
    <div class="flex items-center gap-3">
      <Button icon="i-fluent-emoji-flat-sparkles">
        New
      </Button>
      <NButton type="primary">
        <template #icon>
          <div class="i-fluent-emoji-flat-sparkles"></div>
        </template>
        {{ t("app.interface.generate") }}
      </NButton>
    </div>
  </header>
</template>
