<script setup lang="ts">
import type { UploadFileInfo, UploadSettledFileInfo } from "naive-ui";
import dayjs from "dayjs";
import { useUserStore } from "@/store/user";
import { compressImage } from "@/utils/draw";

const { t, locale } = useI18n();
const message = useMessage();
const dateFormat = computed(() => {
  switch (locale.value) {
    case "zh-CN":
      return "yyyy/MM/dd";
    case "en-US":
      return "MM/dd/yyyy";
    default:
      return "yyyy/MM/dd";
  }
});

const templateStore = useTemplateStore();
const { currentTemplate } = storeToRefs(templateStore);
const userStore = useUserStore();
const { nickname, avatar, no } = storeToRefs(userStore);

const fileList = computed<UploadFileInfo[]>(() => {
  if (avatar.value) {
    return [{
      id: "avatar",
      name: "avatar",
      url: avatar.value,
      status: "finished",
    }];
  }
  return [];
});

function beforeUpload(file: UploadSettledFileInfo) {
  if (!file.type?.includes("image/")) {
    message.error(t("action.user.avatar.typeValidate"));
    return false;
  }
}

async function handleAvatar(fileList: UploadFileInfo[]) {
  if (fileList.length) {
    const _avatar = fileList[0].file;
    if (_avatar) {
      const compressed = await compressImage(_avatar, { limit: 2000000 });
      const reader = new FileReader();
      reader.onload = (e) => {
        avatar.value = e.target?.result as string;
      };
      reader.readAsDataURL(compressed);
    }
  } else {
    avatar.value = "";
  }
}
</script>

<template>
  <div>
    <NH2>{{ t('action.user.title') }}</NH2>
    <NForm label-width="auto">
      <ActionFormItem :label="t('action.user.nickname.title')">
        <NInput v-model:value="nickname" />
      </ActionFormItem>
      <ActionFormItem :label="t('action.user.avatar.title')">
        <NUpload :file-list accept="image/*" directory-dnd :max="1" list-type="image-card" :default-upload="false" @before-upload="v => beforeUpload(v.file)" @update:file-list="handleAvatar">
          <NUploadDragger>
            <div>{{ t('action.user.avatar.placeholder') }}</div>
          </NUploadDragger>
        </NUpload>
      </ActionFormItem>
      <ActionFormItem :label="t('action.user.no.title')">
        <NInputNumber v-model:value="no" :min="1" :max="999999" />
      </ActionFormItem>
      <ActionFormItem :label="t('action.user.date.title')">
        <NDatePicker clearable :formatted-value="currentTemplate?.copywriting.date" value-format="yyyy/MM/dd" :format="dateFormat" @update:formatted-value="v => currentTemplate && (currentTemplate.copywriting.date = v ?? undefined)" />
      </ActionFormItem>
    </NForm>
  </div>
</template>
