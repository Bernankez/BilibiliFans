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
  <NModal v-model:show="show" class="max-h-screen max-w-150" :title="t('changelog.title')" preset="card">
    <NCollapse default-expanded-names="v1" accordion>
      <NCollapseItem title="v1.x" name="v1">
        <NScrollbar class="max-h-60vh" content-style="overflow: hidden;">
          <Changelogv1 class="text-base prose" />
        </NScrollbar>
      </NCollapseItem>
      <NCollapseItem title="v0.x" name="v0">
        <NScrollbar class="max-h-60vh" content-style="overflow: hidden;">
          <Changelogv0 class="text-base prose" />
        </NScrollbar>
      </NCollapseItem>
    </NCollapse>
  </NModal>
</template>

<style scoped>
:global(.n-card .n-card__content) {
  padding-right: 0 !important;
}
</style>
