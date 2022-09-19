<template>
  <aside class="sidebar">
    <div class="sidebar-content">
      <NCollapse :defaultExpandedNames="['card']">
        <NCollapseItem title="分享文案设置" name="article">
          <NForm :model="options" labelWidth="auto">
            <NFormItem label="主播名">
              <NInput v-model:value="options.anchorName"></NInput>
            </NFormItem>
            <NFormItem label="装扮链接">
              <NInput v-model:value="options.customLink"></NInput>
            </NFormItem>
          </NForm>
        </NCollapseItem>
        <NCollapseItem title="卡片设置" name="card">
          <NForm :model="options" labelWidth="auto">
            <NFormItem label="选择背景图片">
              <NUpload
                ref="backgroundImageEl"
                directoryDnd
                :max="1"
                listType="image-card"
                :defaultUpload="false"
                @change="onBackgroundImage">
                <NUploadDragger>
                  <div>点击或拖拽到这里上传文件</div>
                </NUploadDragger>
              </NUpload>
            </NFormItem>
            <NFormItem label="卡片前景渐变色">
              <div class="grid grid-cols-1 gap-2 w-full">
                <NCheckbox v-model:checked="withoutGradient">不使用前景渐变色</NCheckbox>
                <NColorPicker
                  :disabled="withoutGradient"
                  :value="options.gradientColor"
                  @update:value="setGradientColor"
                  :swatches="backgroundPalette"
                  :modes="['hex']"
                  :showAlpha="false"
                  :showPreview="true">
                </NColorPicker>
              </div>
            </NFormItem>
            <NFormItem :label="`渐变范围（${options.gradientStart} —— ${options.gradientEnd}）`">
              <NSlider :disabled="withoutGradient" v-model:value="gradientRange" range :step="1"></NSlider>
            </NFormItem>
            <NFormItem label="字体颜色">
              <NColorPicker v-model:value="options.textColor" :modes="['hex']" :showAlpha="false" :showPreview="true">
              </NColorPicker>
            </NFormItem>
            <NFormItem label="你的头像">
              <NUpload
                ref="avatarEl"
                directoryDnd
                :max="1"
                listType="image-card"
                :defaultUpload="false"
                @change="onAvatar">
                <NUploadDragger>
                  <div>点击或拖拽到这里上传文件</div>
                </NUploadDragger>
              </NUpload>
            </NFormItem>
            <NFormItem label="你的用户名">
              <NInput v-model:value="options.nickname"></NInput>
            </NFormItem>
            <NFormItem label="装扮编号">
              <NInput v-model:value="options.fansNo"></NInput>
            </NFormItem>
            <NFormItem label="获得装扮日期">
              <NDatePicker v-model:value="date" type="date"></NDatePicker>
            </NFormItem>
          </NForm>
        </NCollapseItem>
        <NCollapseItem title="更多设置" name="more">
          <NFormItem label="卡片背景色（一般不用设置）">
            <NColorPicker
              v-model:value="options.backgroundColor"
              :modes="['hex']"
              :showAlpha="false"
              :showPreview="true">
            </NColorPicker>
          </NFormItem>
        </NCollapseItem>
      </NCollapse>
    </div>
    <div class="sidebar-fixed p-3 box-border bg-white">
      <div class="flex flex-col gap-3">
        <NInput
          :value="options.article"
          readonly=""
          type="textarea"
          autosize
          placeholder="这里填写动态文案"
          @focus="onInputFocus"></NInput>
        <NButton class="w-full" type="primary" @click="onGenerate">生成卡片并复制动态</NButton>
        <NButton class="w-full" @click="onReset">重置</NButton>
      </div>
    </div>
  </aside>
</template>

<script setup lang="ts">
import { useAppStore } from "@/store/app-store";
import { useCardStore } from "@/store/card-store";
import Clipboard from "clipboard";
import dayjs from "dayjs";
import {
  NButton,
  NCheckbox,
  NCollapse,
  NCollapseItem,
  NColorPicker,
  NDatePicker,
  NForm,
  NFormItem,
  NInput,
  NSlider,
  NUpload,
  NUploadDragger,
  UploadFileInfo,
  useDialog,
  useMessage,
} from "naive-ui";
// eslint-disable-next-line
// @ts-ignore next-line
import analyze from "rgbaster";

const emit = defineEmits<{
  (event: "generate"): void;
}>();

const cardStore = useCardStore();
const { options, reset } = $(cardStore);
const appStore = useAppStore();
const { sidebarWidth, sidebarFixedHeight } = $(appStore);
// button action
const message = useMessage();
const clip = (e: Event) => {
  const clipboard = new Clipboard(e.target as HTMLElement, { text: () => options.article! });
  clipboard.on("success", e => {
    message.success("复制成功，可以去b站发动态了");
    clipboard.destroy();
  });
  clipboard.on("error", e => {
    message.error("浏览器不支持复制，手动复制一下吧");
    clipboard.destroy();
  });
  (clipboard as any).onClick(e);
};
const onGenerate = (e: MouseEvent) => {
  clip(e);
  emit("generate");
};
const onInputFocus = (e: FocusEvent) => {
  clip(e);
};

const avatarEl = $ref<typeof NUpload>();
const backgroundImageEl = $ref<typeof NUpload>();
const dialog = useDialog();
const onReset = () => {
  dialog.warning({
    title: "重置",
    content: "你确定要重置所有选项吗？",
    positiveText: "我确定",
    negativeText: "点错了",
    onPositiveClick: () => {
      avatarEl?.clear();
      backgroundImageEl?.clear();
      reset();
    },
  });
};

const onAvatar = (data: { fileList: UploadFileInfo[] }) => {
  if (data?.fileList.length > 0) {
    options.avatar = data.fileList[0].file!;
  }
};
type Palette = {
  color: string;
  count: number;
};
let backgroundPaletteHistory = $ref<string[]>([]);
let backgroundPaletteInfer = $ref<Palette[]>([]);
const backgroundPalette = $computed(() =>
  ([] as string[]).concat(backgroundPaletteInfer.map(p => p.color).concat(backgroundPaletteHistory))
);
function setGradientColor(color: string) {
  if (backgroundPaletteHistory.length >= 3) {
    backgroundPaletteHistory.shift();
  }
  backgroundPaletteHistory.push(color);
  options.gradientColor = color;
}
// #ref: https://juejin.cn/post/6844903511956815885
function inferFontColor(color: string) {
  const colors = color.match(/\d+/g)!;
  const grayLevel = Number(colors[0]) * 0.299 + Number(colors[1]) * 0.587 + Number(colors[2]) * 0.114;
  if (grayLevel >= 192) {
    return "#333333";
  } else {
    return "#ffffff";
  }
}
const onBackgroundImage = (data: { fileList: UploadFileInfo[] }) => {
  if (data?.fileList.length > 0) {
    options.backgroundImage = data.fileList[0].file!;
    const url = URL.createObjectURL(data.fileList[0].file!);
    analyze(url).then((res: Palette[]) => {
      URL.revokeObjectURL(url);
      backgroundPaletteInfer = res.slice(0, 3);
      options.textColor = inferFontColor(backgroundPaletteInfer[0].color);
    });
  }
};

// computed prop
const withoutGradient = $computed({
  get() {
    return !options.gradient;
  },
  set(gradient: boolean) {
    options.gradient = !gradient;
  },
});
const date = $computed({
  get() {
    return dayjs(options.date).valueOf();
  },
  set(date: number) {
    options.date = dayjs(date).format("YYYY/MM/DD");
  },
});
const gradientRange = $computed({
  get() {
    const { gradientStart, gradientEnd } = options;
    return [Number(gradientStart?.slice(0, -1)), Number(gradientEnd?.slice(0, -1))];
  },
  set(range: number[]) {
    const min = Math.min(...range);
    const max = Math.max(...range);
    options.gradientStart = min + "%";
    options.gradientEnd = max + "%";
  },
});
</script>

<style lang="scss" scoped>
.sidebar {
  @apply relative shrink-0 h-full bg-background-lighter dark-bg-darkbackground-dark transition-all duration-250;
  width: v-bind("sidebarWidth");
}

.sidebar-content {
  @apply p-3 box-border;
  height: calc(100% - v-bind("sidebarFixedHeight"));
  overflow: auto;
}

.sidebar-fixed {
  @apply b-t b-disabled-light dark-b-darkbackground-light bg-background-lighter dark-bg-darkbackground-dark transition-all duration-250;
  height: v-bind("sidebarFixedHeight");
}
</style>
