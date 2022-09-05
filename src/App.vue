<script setup lang="ts">
import Sidebar from "@/components/Sidebar.vue";
import FansCard from "./components/FansCard.vue";
import ImageCropper from "./components/ImageCropper.vue";
import { Preview } from "./types";
import { nextTick } from "vue";

import Lyj from "@/assets/lyj.webp";
import { useAppStore } from "./store/app-store";

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
  finalImage = await imageCropperEl.getCrop();
  await nextTick();
  fansCardEl.snapshot().then(() => {
    finalImage = "";
  });
};
</script>

<template>
  <div class="flex w-full h-full">
    <main class="flex flex-col lg:flex-row justify-evenly gap-4 items-center w-full h-full bg-background">
      <ImageCropper ref="imageCropperEl" :image="options.backgroundImage" @preview="onPreview"></ImageCropper>
      <FansCard ref="fansCardEl" v-bind="options" class="shrink-0">
        <template #image>
          <img v-if="finalImage" class="w-full h-full" :src="finalImage" alt="backgroundImage" />
          <div v-else :style="preview?.containerStyle">
            <img :src="preview?.src" :style="preview?.imageStyle" />
          </div>
        </template>
      </FansCard>
      <button @click="onClick">generate</button>
    </main>
    <Sidebar></Sidebar>
  </div>
</template>

<style scoped></style>
