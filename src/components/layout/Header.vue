<template>
  <header
    class="header fixed top-0 flex items-center justify-between p-x-6 box-border text-default bg-background-lighter dark:bg-darkbackground dark:text-darkdefault cursor-default transition-all duration-250">
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
        class="text-5 cursor-pointer text-default-light dark:text-darkdefault hover:text-default hover:dark:text-darkdefault-lighter transition-all duration-250"
        @click="showChangelog = true">
        v{{ version }}
      </div>
      <div class="divide-vertical"></div>
      <NSwitch v-model:value="isDark" :railStyle="railStyle">
        <template #unchecked-icon>
          <div class="i-uil:brightness"></div>
        </template>
        <template #checked-icon>
          <div class="i-uil:moon rotate-y-180"></div>
        </template>
      </NSwitch>
      <div class="divide-vertical"></div>
      <a
        class="text-default-light hover:text-default dark:text-darkdefault hover:dark:text-darkdefault-lighter transition-all duration-250"
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
import { colorBackground, colorDarkBackground } from "@/style/theme";
import version from "@/version";
import { NSpace, NSwitch } from "naive-ui";
import { CSSProperties } from "vue";

const showChangelog = $ref(false);

const appStore = useAppStore();
const { headerHeight, sidebarWidth, isDark } = $(appStore);

const railStyle = ({ focused, checked }: { focused: boolean; checked: boolean }) => {
  const style: CSSProperties = {};
  if (checked) {
    style.background = colorDarkBackground.light;
    if (focused) {
      style.boxShadow = `0 0 0 2px ${colorDarkBackground.lighter}`;
    }
  } else {
    style.background = colorBackground.dark;
    if (focused) {
      style.boxShadow = `0 0 0 2px ${colorBackground.DEFAULT}`;
    }
  }
  return style;
};
</script>

<style lang="scss" scoped>
.header {
  height: v-bind("headerHeight");
  width: calc(100% - v-bind("sidebarWidth"));
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
