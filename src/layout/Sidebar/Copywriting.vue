<script setup lang="ts">
const { t } = useI18n();
</script>

<template>
  <div>
    <NForm label-width="auto">
      <NFormItem :label="t('sidebar.sharingCopywriting.vtuberName')">
        <NInput />
      </NFormItem>
      <NFormItem :label="t('sidebar.sharingCopywriting.themeLink')">
        <template #label>
          {{ t('sidebar.sharingCopywriting.themeLink') }}
          <NButton quaternary size="small" type="primary">
            {{ t('sidebar.sharingCopywriting.resetThemeLink') }}
          </NButton>
        </template>
        <NInput type="textarea" />
      </NFormItem>
    </NForm>
  </div>
</template>
