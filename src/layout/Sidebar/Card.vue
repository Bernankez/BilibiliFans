<script setup lang="ts">
import { compressImage, fitBackground } from "@/utils/draw";
import type { UploadFileInfo, UploadSettledFileInfo } from "naive-ui";
import { useDisabled } from "./useDisabled";

const { t } = useI18n();
const message = useMessage();

const templateStore = useTemplateStore();
const { currentTemplate } = storeToRefs(templateStore);

const { url: backgroundUrl } = useBlobUrl(computed(() => currentTemplate.value?.cardStyle.background.image));
const { palette } = usePalette(backgroundUrl, 10);
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

function setBackgroundGradientLeftColor(color: string) {
  if (currentTemplate.value?.cardStyle.foreground?.gradient.left) {
    currentTemplate.value.cardStyle.foreground.gradient.left.color = color;
    currentTemplate.value.cardStyle.color = inferFontColor(color);
  }
}

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
      currentTemplate.value.cardStyle.background.image = await compressImage(background, { limit: 5000000, log: true });
      const { width, height } = await getImageDimensions(background);
      const { origin, size } = fitBackground(width, height);
      currentTemplate.value.cardStyle.background.origin = origin;
      currentTemplate.value.cardStyle.background.size = size;
    }
  } else {
    currentTemplate.value.cardStyle.background.image = undefined;
  }
}

function getImageDimensions(file: File | Blob): Promise<{ width: number; height: number }> {
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

const { disabled } = useDisabled();
</script>

<template>
  <div>
    <NH2>
      {{ t('action.card.title') }}
    </NH2>
    <NForm :disabled label-width="auto">
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
      <NCollapseTransition :show="true">
        <ActionFormItem :label="t('action.card.form.foreground.left.title')">
          <div class="flex flex-col gap-2">
            <div class="flex flex-wrap gap-2">
              <Palette v-for="color in palette" :key="color.color" :color="color.color" @click="setBackgroundGradientLeftColor(color.color)" />
            </div>
            <NColorPicker :value="currentTemplate?.cardStyle.foreground?.gradient.left?.color" show-preview @update:value="v => currentTemplate?.cardStyle.foreground?.gradient.left && (currentTemplate.cardStyle.foreground.gradient.left.color = v)" />
          </div>
        </ActionFormItem>
        <ActionFormItem :label="`${t('action.card.form.foreground.leftGradient.title')}（${leftGradient[0]}% - ${leftGradient[1]}%）`">
          <NSlider v-model:value="leftGradient" range :step="1" />
        </ActionFormItem>
      </NCollapseTransition>
    </NForm>
  </div>
</template>
