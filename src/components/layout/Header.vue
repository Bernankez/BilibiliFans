<template>
  <header
    class="header fixed top-0 flex items-center justify-between p-x-6 box-border text-default bg-background-lighter dark:bg-darkbackground dark:text-darkdefault cursor-default transition-all duration-250">
    <div class="flex items-center">
      <img class="h-8 w-8 m-r-2 rounded-1" src="/logo.png" alt="Bilibili Fans logo" />
      <NSpace align="baseline">
        <div class="title">Bilibili Fans</div>
        <div class="display-none lg:inline">一键制作你的粉丝装扮卡片</div>
      </NSpace>
    </div>
    <NSpace class="display-none! md:flex!" align="center">
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
    <div
      class="md:display-none p-1 box-border rounded-1 cursor-pointer hover:bg-background hover:dark:bg-darkbackground-light">
      <NDropdown trigger="click" :options="dropdownItems" @select="onDropdownItem">
        <div class="i-uil:align-right text-5"></div>
      </NDropdown>
    </div>
  </header>
  <ChangelogDialog v-model="showChangelog"></ChangelogDialog>
</template>

<script setup lang="ts">
import ChangelogDialog from "@/components/change-log/ChangelogDialog.vue";
import { useAppStore } from "@/store/app-store";
import { colorBackground, colorDarkBackground } from "@/style/theme";
import version from "@/version";
import { NDropdown, NSpace, NSwitch } from "naive-ui";
import { CSSProperties } from "vue";

let showChangelog = $ref(false);

const appStore = useAppStore();
let { headerHeight, sidebarWidth, isDark } = $(appStore);

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

const dropdownItems = $computed(() => [
  {
    label: `v${version}`,
    key: "version",
  },
  {
    label: `切换至${isDark ? "亮色☀️" : "暗色🌙"}`,
    key: "appearance",
  },
  {
    label: `去Github看看👀`,
    key: "github",
  },
]);
const onDropdownItem = (key: string) => {
  switch (key) {
    case "version":
      showChangelog = true;
      break;
    case "appearance":
      isDark = !isDark;
      break;
    case "github":
      window.open("https://github.com/Bernankez/BilibiliFans", "_blank");
      break;
  }
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