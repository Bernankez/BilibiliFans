<script setup lang="ts">
import { NConfigProvider, zhCN, dateZhCN, NLocale, NDateLocale, darkTheme } from "naive-ui";
import Sidebar from "@/components/Sidebar.vue";
import FansCard from "./components/FansCard.vue";
import ImageCropper from "./components/ImageCropper.vue";
import { Preview } from "./types";
import { nextTick } from "vue";

import Lyj from "@/assets/lyj.webp";
import { useAppStore } from "./store/app-store";

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
const onClick = async () => {
  finalImage = await imageCropperEl.crop();
  await nextTick();
  fansCardEl.snapshot().then((canvas: HTMLCanvasElement) => {
    document.body.appendChild(canvas);
    finalImage = "";
  });
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
      <Sidebar></Sidebar>
    </div>
  </NConfigProvider>
</template>

<style scoped></style>
