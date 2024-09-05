<script setup lang="ts">
import { NScrollbar } from "naive-ui";
import Changelogv1 from "~/CHANGELOG.md";
import Changelogv0 from "~/CHANGELOG_v0.md";

const { t } = useI18n();

const show = defineModel("show", {
  default: false,
});
</script>

<template>
  <NModal v-model:show="show" class="max-w-150" :title="t('changelog.title')" preset="card">
    <NTabs type="card" default-value="v1">
      <NTabPane name="v1" label="v1">
        <NScrollbar class="h-60vh">
          <Changelogv1 class="text-base prose" />
        </NScrollbar>
      </NTabPane>
      <NTabPane name="v0" label="v0">
        <NScrollbar class="h-60vh">
          <Changelogv0 class="text-base prose" />
        </NScrollbar>
      </NTabPane>
    </NTabs>
  </NModal>
</template>
