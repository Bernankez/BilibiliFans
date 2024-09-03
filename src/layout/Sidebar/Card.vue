<script setup lang="ts">
import type { UploadFileInfo, UploadSettledFileInfo } from "naive-ui";
import { fitBackground } from "@/utils/draw";

const { t } = useI18n();
const message = useMessage();

const templateStore = useTemplateStore();
const { currentTemplate } = storeToRefs(templateStore);

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

const leftGradient = computed({
  get: () => {
    const { start = 0, end = 0 } = currentTemplate.value?.cardStyle.foreground?.gradient.left || {};
    return [Math.round(start * 100), Math.round(end * 100)];
  },
  set: (v) => {
    const start = Math.min(...v);
    const end = Math.max(...v);
    if (currentTemplate.value) {
      const left = {
        start: Number((start / 100).toFixed(2)),
        end: Number((end / 100).toFixed(2)),
        color: currentTemplate.value!.cardStyle.foreground!.gradient.left!.color,
      };
      currentTemplate.value.cardStyle.foreground = {
        ...currentTemplate.value.cardStyle.foreground,
        gradient: {
          ...currentTemplate.value.cardStyle.foreground?.gradient,
          left,
        },
      };
    }
  },
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
      URL.revokeObjectURL(img.src);
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
        <NColorPicker :value="currentTemplate?.cardStyle.color" show-preview @update:value="v => currentTemplate && (currentTemplate.cardStyle.color = v)" />
      </ActionFormItem>
      <ActionFormItem :label="t('action.card.form.backgroundImage.title')">
        <NUpload :file-list accept="image/*" object-fit="scale-down" :should-use-thumbnail-url="() => true" directory-dnd :max="1" list-type="image-card" :default-upload="false" @before-upload="v => beforeUpload(v.file)" @update:file-list="handleBackground">
          <NUploadDragger>
            <div>{{ t('action.card.form.backgroundImage.placeholder') }}</div>
          </NUploadDragger>
        </NUpload>
      </ActionFormItem>
      <ActionFormItem :label="t('action.card.form.background.title')">
        <NColorPicker :value="currentTemplate?.cardStyle.background.color || '#ffffffff'" show-preview @update:value="v => currentTemplate && (currentTemplate.cardStyle.background.color = v)" />
      </ActionFormItem>
      <div>
        <NCollapseTransition :show="true">
          <div class="mt-4">
            <ActionFormItem :label="t('action.card.form.foreground.left.title')">
              <NColorPicker :value="currentTemplate?.cardStyle.foreground?.gradient.left?.color" show-preview @update:value="v => currentTemplate?.cardStyle.foreground?.gradient.left && (currentTemplate.cardStyle.foreground.gradient.left.color = v)" />
            </ActionFormItem>
            <ActionFormItem :label="`${t('action.card.form.foreground.leftGradient.title')}（${leftGradient[0]}% - ${leftGradient[1]}%）`">
              <NSlider v-model:value="leftGradient" range :step="1" />
            </ActionFormItem>
          </div>
        </NCollapseTransition>
      </div>
    </NForm>
  </div>
</template>
