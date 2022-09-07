<script setup lang="ts">
import {
  NDialogProvider,
  NMessageProvider,
  NConfigProvider,
  zhCN,
  dateZhCN,
  NLocale,
  NDateLocale,
  darkTheme,
} from "naive-ui";
import Sidebar from "@/components/Sidebar.vue";
import FansCard from "./components/FansCard.vue";
import ImageCropper from "./components/ImageCropper.vue";
import { Preview } from "./types";
import { nextTick } from "vue";

import Lyj from "@/assets/lyj.webp";
import { useAppStore } from "./store/app-store";
import dayjs from "dayjs";

const locale = $ref<NLocale>(zhCN);
const dateLocale = $ref<NDateLocale>(dateZhCN);

const appStore = useAppStore();
const { options } = $(appStore);
options.avatar = Lyj;
options.backgroundImage = Lyj;

let preview = $ref<Preview | undefined>();
const onPreview = (_preview: Preview) => {
  preview = _preview;
};

let finalImage = $ref("");
const imageCropperEl = $ref<typeof ImageCropper>();
const fansCardEl = $ref<typeof FansCard>();

const onGenerate = async () => {
  finalImage = await imageCropperEl.crop();
  await nextTick();
  fansCardEl.snapshot().then((canvas: HTMLCanvasElement) => {
    const dataURL = canvas.toDataURL("image/png");
    const arr = dataURL.split(",");
    const MIME = arr[0].match(/:(.*?);/)?.[1];
    const bstr = window.atob(arr[1]);
    let n = bstr.length;
    const u8arr = new Uint8Array(n);
    while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }
    const filename = options.anchorName + " - " + options.fansNo;
    const file = new File([u8arr], filename, {
      type: MIME,
      lastModified: dayjs().valueOf(),
    });
    const a = document.createElement("a");
    const url = URL.createObjectURL(file);
    a.href = url;
    a.download = filename + ".png";
    a.click();
    URL.revokeObjectURL(url);
  });
};

window.onbeforeunload = function (e) {
  return false;
};
</script>

<template>
  <NConfigProvider :locale="locale" :dateLocale="dateLocale" abstract>
    <div class="flex min-w-fit w-full h-full">
      <main class="flex p-3 box-border justify-evenly gap-4 items-center w-full h-full overflow-x-auto bg-background">
        <ImageCropper ref="imageCropperEl" :image="options.backgroundImage" @preview="onPreview"></ImageCropper>
        <FansCard ref="fansCardEl" v-bind="options" class="shrink-0">
          <template #image>
            <img v-if="finalImage" class="w-full h-full" :src="finalImage" alt="backgroundImage" />
            <div v-else :style="preview?.containerStyle">
              <img :src="preview?.src" :style="preview?.imageStyle" />
            </div>
          </template>
        </FansCard>
        <!-- <button @click="onClick">generate</button> -->
      </main>
      <NMessageProvider>
        <NDialogProvider>
          <Sidebar @generate="onGenerate"></Sidebar>
        </NDialogProvider>
      </NMessageProvider>
    </div>
  </NConfigProvider>
</template>

<style lang="scss" scoped></style>
