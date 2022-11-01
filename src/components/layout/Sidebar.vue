<template>
  <aside class="sidebar">
    <div class="sidebar-content">
      <NCollapse :default-expanded-names="['card']">
        <NCollapseItem title="分享文案设置" name="article">
          <NForm :model="options" label-width="auto">
            <NFormItem label="主播名">
              <NInput v-model:value="options.anchorName" />
            </NFormItem>
            <NFormItem label="装扮链接">
              <NInput v-model:value="options.customLink" />
            </NFormItem>
          </NForm>
        </NCollapseItem>
        <NCollapseItem title="卡片设置" name="card">
          <NForm :model="options" label-width="auto">
            <NFormItem label="选择背景图片">
              <NUpload
                ref="backgroundImageEl" directory-dnd :max="1" list-type="image-card" :default-upload="false"
                @change="onBackgroundImage"
              >
                <NUploadDragger>
                  <div>点击或拖拽到这里上传文件</div>
                </NUploadDragger>
              </NUpload>
            </NFormItem>
            <NFormItem label="卡片前景渐变色">
              <div class="grid grid-cols-1 gap-2 w-full">
                <NCheckbox v-model:checked="withoutGradient">
                  不使用前景渐变色
                </NCheckbox>
                <NColorPicker
                  :disabled="withoutGradient" :value="options.gradientColor" :swatches="backgroundPalette"
                  :modes="['hex']" :show-alpha="false" :show-preview="true" @update:value="setGradientColor"
                />
                <div v-if="backgroundPaletteInfer.length > 0" class="flex items-center">
                  推荐颜色：
                  <div class="grid grid-cols-3 gap-2">
                    <ColorSquare
                      v-for="color in backgroundPaletteInfer" :key="color.color" :disabled="withoutGradient"
                      :color="color.color" @click="onPaletteInfer"
                    />
                  </div>
                </div>
              </div>
            </NFormItem>
            <NFormItem :label="`渐变范围（${options.gradientStart} —— ${options.gradientEnd}）`">
              <NSlider v-model:value="gradientRange" :disabled="withoutGradient" range :step="1" />
            </NFormItem>
            <NFormItem label="字体颜色">
              <NColorPicker
                v-model:value="options.textColor" :modes="['hex']" :show-alpha="false"
                :show-preview="true"
              />
            </NFormItem>
            <NFormItem label="你的头像">
              <NUpload
                ref="avatarEl" directory-dnd :max="1" list-type="image-card" :default-upload="false"
                @change="onAvatar"
              >
                <NUploadDragger>
                  <div>点击或拖拽到这里上传文件</div>
                </NUploadDragger>
              </NUpload>
            </NFormItem>
            <NFormItem label="你的用户名">
              <NInput v-model:value="options.nickname" />
            </NFormItem>
            <NFormItem label="装扮编号">
              <NInput v-model:value="options.fansNo" />
            </NFormItem>
            <NFormItem label="获得装扮日期">
              <NDatePicker v-model:value="date" type="date" />
            </NFormItem>
          </NForm>
        </NCollapseItem>
        <NCollapseItem title="更多设置" name="more">
          <NFormItem label="卡片背景色（一般不用设置）">
            <NColorPicker
              v-model:value="options.backgroundColor" :modes="['hex']" :show-alpha="false"
              :show-preview="true"
            />
          </NFormItem>
          <NFormItem label="框选设置">
            <div class="grid grid-cols-1 gap-2 w-full">
              <NCheckbox v-model:checked="options.boxInsideImage">
                框选范围限制在图片内
              </NCheckbox>
              <NCheckbox v-model:checked="options.imageScale">
                允许图片缩放
              </NCheckbox>
              <NCheckbox v-model:checked="options.imageMove">
                允许图片拖动
              </NCheckbox>
              <NButton secondary @click="emit('resetCropper')">
                重置截图框
              </NButton>
            </div>
          </NFormItem>
        </NCollapseItem>
      </NCollapse>
    </div>
    <div class="sidebar-fixed p-3 box-border bg-white">
      <div class="flex flex-col gap-3">
        <NInput
          :value="options.article" readonly="" type="textarea" autosize placeholder="这里填写动态文案"
          @focus="onInputFocus"
        />
        <div class="flex items-center">
          <NText class="shrink-0 m-r-3 text-[14px]">
            生成图像大小
          </NText>
          <NSelect v-model:value="quality" :options="qualityOptions" />
        </div>
        <NButton class="w-full" type="primary" @click="onGenerate">
          生成卡片并复制动态
        </NButton>
        <NButton class="w-full" @click="onReset">
          重置
        </NButton>
      </div>
    </div>
  </aside>
</template>

<script setup lang="ts">
import Clipboard from "clipboard";
import dayjs from "dayjs";
import type { UploadFileInfo } from "naive-ui";
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
  NSelect,
  NSlider,
  NUpload,
  NUploadDragger,
  useDialog,
  useMessage,
} from "naive-ui";
// eslint-disable-next-line @typescript-eslint/prefer-ts-expect-error
// @ts-ignore next-line
import analyze from "rgbaster";
import ColorSquare from "../ui/ColorSquare.vue";
import { useCardStore } from "@/store/card-store";
import { useAppStore } from "@/store/app-store";
import type { Quality } from "@/types";

const emit = defineEmits<{
  (event: "generate"): void;
  (event: "resetCropper"): void;
}>();

const qualityOptions: { label: string; value: Quality }[] = [
  {
    label: "小(607x250)",
    value: "small",
  },
  {
    label: "默认(1093x450)",
    value: "default",
  },
  {
    label: "大(2126x875)",
    value: "large",
  },
];

const cardStore = useCardStore();
const { options, reset, quality } = $(cardStore);
const appStore = useAppStore();
const { sidebarWidth, sidebarFixedHeight } = $(appStore);
// button action
const message = useMessage();
const clip = (e: Event) => {
  const clipboard = new Clipboard(e.target as HTMLElement, { text: () => options.article! });
  clipboard.on("success", (e) => {
    message.success("复制成功，可以去b站发动态了");
    clipboard.destroy();
  });
  clipboard.on("error", (e) => {
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
  if (data?.fileList.length > 0) { options.avatar = data.fileList[0].file!; }
};
interface Palette {
  color: string;
  count: number;
}
const backgroundPaletteHistory = $ref<string[]>([]);
let backgroundPaletteInfer = $ref<Palette[]>([]);
const backgroundPalette = $computed(() => ([] as string[]).concat(backgroundPaletteHistory));
function setGradientColor(color: string) {
  if (backgroundPaletteInfer.findIndex(p => p.color === color) === -1 && !backgroundPaletteHistory.includes(color)) { backgroundPaletteHistory.push(color); }

  if (backgroundPaletteHistory.length >= 9) { backgroundPaletteHistory.shift(); }

  options.gradientColor = color;
}
// #ref: https://juejin.cn/post/6844903511956815885
function inferFontColor(color: string) {
  const colors = color.match(/\d+/g)!;
  const grayLevel = Number(colors[0]) * 0.299 + Number(colors[1]) * 0.587 + Number(colors[2]) * 0.114;
  if (grayLevel >= 192) { return "#333333"; } else { return "#ffffff"; }
}
const onBackgroundImage = (data: { fileList: UploadFileInfo[] }) => {
  if (data?.fileList.length > 0) {
    options.backgroundImage = data.fileList[0].file!;
    const url = URL.createObjectURL(data.fileList[0].file!);
    analyze(url).then((res: Palette[]) => {
      URL.revokeObjectURL(url);
      backgroundPaletteInfer = res.slice(0, 3);
      options.textColor = inferFontColor(backgroundPaletteInfer[0].color);
      options.gradientColor = backgroundPaletteInfer[0].color;
    });
  }
};
const onPaletteInfer = (color: string) => {
  options.gradientColor = color;
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
    options.gradientStart = `${min}%`;
    options.gradientEnd = `${max}%`;
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
