<script setup lang="ts">
const { t } = useI18n();
</script>

<template>
  <div>
    <NH2>
      {{ t("action.copywriting.title") }}
    </NH2>
    <NForm label-width="auto">
      <ActionFormItem :label="t('action.copywriting.form.vtuberName.title')">
        <NInput />
      </ActionFormItem>
      <ActionFormItem>
        <template #label>
          <div class="w-full flex items-center justify-between">
            {{ t('action.copywriting.form.themeLink.title') }}
            <NButton quaternary size="small" type="primary">
              {{ t('action.copywriting.form.themeLink.reset') }}
            </NButton>
          </div>
        </template>
        <NInput type="textarea" />
      </ActionFormItem>
      <ActionFormItem :label="t('action.copywriting.form.post.title')">
        <NInput type="textarea" />
      </ActionFormItem>
    </NForm>
  </div>
</template>
