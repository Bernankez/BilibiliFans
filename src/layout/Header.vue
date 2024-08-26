<script setup lang="ts">
const { t } = useI18n();
</script>

<template>
  <header class="h-[var(--header-height)] flex items-center justify-between b-b-1 b-border b-solid p-2">
    <div>
    </div>
    <div class="flex items-center gap-3">
      <NButton type="primary">
        {{ t("app.interface.generate") }}
      </NButton>
    </div>
  </header>
</template>
