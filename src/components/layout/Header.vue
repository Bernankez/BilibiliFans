<template>
  <header
    class="header absolute w-full flex items-center justify-between p-x-6 box-border text-default bg-background-lighter dark:bg-darkbackground-light cursor-default">
    <div class="flex items-center">
      <img class="h-8 w-8 m-r-2 rounded-1" src="/logo.png" alt="Bilibili Fans logo" />
      <NSpace align="baseline">
        <div class="title">Bilibili Fans</div>
        <div class="subtitle">一键制作你的粉丝动态卡片</div>
      </NSpace>
    </div>
    <NSpace align="center">
      <div
        role="button"
        class="text-5 cursor-pointer text-default-light hover:text-default transition-all duration-250"
        @click="showChangelog = true">
        v{{ version }}
      </div>
      <div class="divide-vertical"></div>
      <a
        class="text-default-light hover:text-default transition-all duration-250"
        href="https://github.com/Bernankez/BilibiliFans"
        target="_blank">
        <div class="i-uil:github text-8"></div>
      </a>
    </NSpace>
  </header>
  <ChangelogDialog v-model="showChangelog"></ChangelogDialog>
</template>

<script setup lang="ts">
import ChangelogDialog from "@/components/change-log/ChangelogDialog.vue";
import { useAppStore } from "@/store/app-store";
import version from "@/version";
import { NSpace } from "naive-ui";

const showChangelog = $ref(false);

const appStore = useAppStore();
const { headerHeight } = $(appStore);
</script>

<style lang="scss" scoped>
.header {
  height: v-bind("headerHeight");
  font-family: "Inter var experimental", "Inter var", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen,
    Ubuntu, Cantarell, "Fira Sans", "Droid Sans", "Helvetica Neue", sans-serif;
}

.title {
  @apply text-6;
}

.divide-vertical {
  @apply h-5 w-[1px] bg-default-lighter;
}
</style>
