<script setup lang="ts">
import type { UploadFileInfo, UploadSettledFileInfo } from "naive-ui";
import { fitBackground } from "@/utils/draw";

const { t } = useI18n();
const message = useMessage();

const templateStore = useTemplateStore();
const { currentTemplate } = storeToRefs(templateStore);

const showForeground = ref(true);

const { url: backgroundUrl } = useBlobUrl(computed(() => currentTemplate.value?.cardStyle.background.image));
const fileList = computed<UploadFileInfo[]>(() => {
  if (backgroundUrl.value) {
    return [{
      id: "background",
      name: "background",
      thumbnailUrl: backgroundUrl.value,
      status: "finished",
    }];
  }
  return [];
});

function beforeUpload(file: UploadSettledFileInfo) {
  if (!file.type?.includes("image/")) {
    message.error(t("action.card.form.backgroundImage.typeValidate"));
    return false;
  }
}

async function handleBackground(fileList: UploadFileInfo[]) {
  if (!currentTemplate.value) {
    return;
  }
  if (fileList.length) {
    const background = fileList[0].file;
    if (background) {
      currentTemplate.value.cardStyle.background.image = background;
      const { width, height } = await getImageDimensions(background);
      const { origin, size } = fitBackground(width, height);
      currentTemplate.value.cardStyle.background.origin = origin;
      currentTemplate.value.cardStyle.background.size = size;
    }
  } else {
    currentTemplate.value.cardStyle.background.image = undefined;
  }
}

function getImageDimensions(file: File): Promise<{ width: number; height: number }> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      resolve({ width: img.width, height: img.height });
    };
    img.onerror = reject;
    img.src = URL.createObjectURL(file);
  });
}
</script>

<template>
  <div>
    <NH2>
      {{ t('action.card.title') }}
    </NH2>
    <NForm label-width="auto">
      <ActionFormItem :label="t('action.card.form.fontColor.title')">
        <NColorPicker :value="currentTemplate?.cardStyle.color" :show-alpha="false" show-preview />
      </ActionFormItem>
      <ActionFormItem :label="t('action.card.form.backgroundImage.title')">
        <NUpload :file-list accept="image/*" object-fit="scale-down" :should-use-thumbnail-url="() => true" directory-dnd :max="1" list-type="image-card" :default-upload="false" @before-upload="v => beforeUpload(v.file)" @update:file-list="handleBackground">
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
