<template>
  <div class="sidebar">
    <NScrollbar style="height: calc(100vh - 268px)">
      <NCollapse :defaultExpandedNames="['card']">
        <NCollapseItem title="分享文案设置" name="article">
          <NForm :model="options" labelWidth="auto">
            <NFormItem label="主播名" labelPlacement="left">
              <NInput v-model:value="options.anchorName"></NInput>
            </NFormItem>
            <NFormItem label="装扮链接">
              <NInput v-model:value="options.customLink"></NInput>
            </NFormItem>
          </NForm>
        </NCollapseItem>
        <NCollapseItem title="卡片设置" name="card">
          <NForm :model="options" labelWidth="auto">
            <NFormItem label="你的头像" labelPlacement="left">
              <NUpload directoryDnd :max="1" listType="image-card" :defaultUpload="false" @change="onAvatar">
                <NUploadDragger>
                  <div>点击或拖拽到这里上传文件</div>
                </NUploadDragger>
              </NUpload>
            </NFormItem>
            <NFormItem label="你的用户名" labelPlacement="left">
              <NInput v-model:value="options.nickname"></NInput>
            </NFormItem>
            <NFormItem label="装扮编号" labelPlacement="left">
              <NInput v-model:value="options.fansNo"></NInput>
            </NFormItem>
            <NFormItem label="获得装扮日期">
              <NDatePicker v-model:value="date" type="date"></NDatePicker>
            </NFormItem>
            <NFormItem label="卡片背景色（一般不用设置）">
              <NColorPicker
                v-model:value="options.backgroundColor"
                :modes="['hex']"
                :showAlpha="false"
                :showPreview="true"></NColorPicker>
            </NFormItem>
            <NFormItem label="卡片左侧渐变色">
              <NColorPicker
                v-model:value="options.gradientColor"
                :modes="['hex']"
                :showAlpha="false"
                :showPreview="true"></NColorPicker>
            </NFormItem>
          </NForm>
        </NCollapseItem>
      </NCollapse>
    </NScrollbar>
    <div class="absolute bottom-0 left-0 right-0 h-67 p-3 box-border bg-white">
      <div class="flex flex-col gap-3">
        <NInput :value="options.article" readonly="" type="textarea" autosize placeholder="这里填写动态文案"></NInput>
        <NButton class="w-full" type="primary">生成卡片并复制动态</NButton>
        <NButton class="w-full">重置</NButton>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import dayjs from "dayjs";
import { useAppStore } from "@/store/app-store";
import {
  NButton,
  NForm,
  NFormItem,
  NCollapse,
  NCollapseItem,
  NInput,
  NUpload,
  NUploadDragger,
  NDivider,
  NScrollbar,
  NDatePicker,
  NColorPicker,
  UploadFileInfo,
} from "naive-ui";

const appStore = useAppStore();
const { options } = $(appStore);

const onAvatar = (data: { fileList: UploadFileInfo[] }) => {
  if (data?.fileList.length > 0) {
    options.avatar = data.fileList[0].file!;
  }
};
const date = $computed({
  get() {
    return dayjs(options.date).valueOf();
  },
  set(date: number) {
    options.date = dayjs(date).format("YYYY/MM/DD");
  },
});
</script>

<style lang="scss" scoped>
.sidebar {
  @apply relative shrink-0 h-full w-70 p-3 box-border;
  box-shadow: -1px 0 10px 0px #eee;
}
</style>
