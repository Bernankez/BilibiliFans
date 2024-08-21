<script setup lang="ts">
const { t } = useI18n();

const showForeground = ref(true);
</script>

<template>
  <div>
    <NH2>
      {{ t('action.card.title') }}
    </NH2>
    <NForm label-width="auto">
      <ActionFormItem :label="t('action.card.form.fontColor.title')">
        <NColorPicker />
      </ActionFormItem>
      <ActionFormItem :label="t('action.card.form.backgroundImage.title')">
        <NUpload
          directory-dnd :max="1" list-type="image-card" :default-upload="false"
        >
          <NUploadDragger>
            <div>{{ t('action.card.form.backgroundImage.placeholder') }}</div>
          </NUploadDragger>
        </NUpload>
      </ActionFormItem>
      <ActionFormItem :label="t('action.card.form.background.title')">
        <NColorPicker />
      </ActionFormItem>
      <div>
        <NCheckbox v-model:checked="showForeground" class="w-full">
          <div>{{ t('action.card.form.foreground.title') }}</div>
        </NCheckbox>
        <NCollapseTransition :show="showForeground">
          <div class="mt-4">
            <ActionFormItem :label="t('action.card.form.foreground.left.title')">
              <NColorPicker />
            </ActionFormItem>
            <ActionFormItem :label="t('action.card.form.foreground.leftGradient.title')">
              <NSlider :step="1" />
            </ActionFormItem>
          </div>
        </NCollapseTransition>
      </div>
    </NForm>
  </div>
</template>
