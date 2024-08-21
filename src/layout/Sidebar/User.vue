<script setup lang="ts">
const { t } = useI18n();
</script>

<template>
  <div>
    <NH2>{{ t('action.user.title') }}</NH2>
    <NForm label-width="auto">
      <ActionFormItem :label="t('action.user.nickname.title')">
        <NInput />
      </ActionFormItem>
      <ActionFormItem :label="t('action.user.avatar.title')">
        <NUpload
          directory-dnd :max="1" list-type="image-card" :default-upload="false"
        >
          <NUploadDragger>
            <div>{{ t('action.user.avatar.placeholder') }}</div>
          </NUploadDragger>
        </NUpload>
      </ActionFormItem>
      <ActionFormItem :label="t('action.user.no.title')">
        <NInputNumber :min="1" :max="999999" />
      </ActionFormItem>
      <ActionFormItem :label="t('action.user.date.title')">
        <NDatePicker />
      </ActionFormItem>
    </NForm>
  </div>
</template>
