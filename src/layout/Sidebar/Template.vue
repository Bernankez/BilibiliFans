<script setup lang="ts">
import type { SelectGroupOption, SelectOption } from "naive-ui";

const { t } = useI18n();

const options = ref<(SelectOption | SelectGroupOption)[]>([
  {
    type: "group",
    label: t("action.template.select.placeholder.default"),
    children: [
    ],
  },
  {
    type: "group",
    label: t("action.template.select.placeholder.custom"),
    children: [
    ],
  },
]);
</script>

<template>
  <div>
    <NH2>{{ t('action.template.title') }}</NH2>
    <NForm label-width="auto">
      <ActionFormItem :label="`${t('action.template.current')}: ${t('action.template.none')}`">
        <div class="flex flex-col gap-2">
          <NButton type="primary">
            {{ t('action.template.saveAs.title') }}
          </NButton>
          <NButton type="primary" secondary>
            {{ t('action.template.save.title') }}
          </NButton>
          <NButton type="primary" tertiary>
            {{ t('action.template.export.title') }}
          </NButton>
        </div>
      </ActionFormItem>
      <ActionFormItem :label="t('action.template.select.title')">
        <div class="flex flex-col gap-2">
          <NSelect :options />
          <NButton type="primary" tertiary>
            {{ t('action.template.load.title') }}
          </NButton>
        </div>
      </ActionFormItem>
    </NForm>
  </div>
</template>
