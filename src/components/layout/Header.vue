<template>
  <header
    class="header z-1 fixed top-0 flex items-center justify-between p-x-6 box-border text-default backdrop-saturate-50 backdrop-blur-8 bg-opacity-70 dark:bg-opacity-70 bg-background-lighter dark:bg-darkbackground dark:text-darkdefault cursor-default transition-all duration-250"
  >
    <div class="flex items-center overflow-hidden">
      <img class="display-none md:inline h-8 w-8 m-r-2 rounded-1" src="/logo.png" alt="Bilibili Fans logo" />
      <NSpace align="baseline">
        <div class="display-none text-6 truncate">
          Bilibili Fans
        </div>
        <div>
          <NButton class="text-4" text tag="a" href="https://space.bilibili.com/5659864" target="_blank">
            <strong>鹿野灸</strong>
          </NButton>
          装扮
          <strong>3月12日 19:00</strong>
          开售
          <NButton class="text-4" type="primary" text tag="a" href="https://www.bilibili.com/h5/mall/suit/detail?navhide=1&id=106232701&native.theme=1&night=0" target="_blank">
            <span class="font-bold">点这里买一个喵🥺</span>
          </NButton>
        </div>
      </NSpace>
    </div>
    <NSpace class="display-none! lg:flex!" align="center">
      <div
        role="button"
        class="text-5 cursor-pointer text-default-light dark:text-darkdefault hover:text-default hover:dark:text-darkdefault-lighter transition-all duration-250"
        @click="showChangelog = true"
      >
        v{{ version }}
      </div>
      <!-- <div class="divide-vertical"></div> -->
      <!-- <NPopover trigger="hover" :keep-alive-on-hover="false">
        <template #trigger>
          <NSwitch v-model:value="autoAdjust" :rail-style="railStyle" title="自适应缩放">
            <template #unchecked-icon>
              <div class="i-uil:square-shape"></div>
            </template>
            <template #checked-icon>
              <div class="i-uil:panorama-h-alt"></div>
            </template>
          </NSwitch>
        </template>
        <span>自适应缩放</span>
      </NPopover> -->
      <div class="divide-vertical"></div>
      <NSwitch v-model:value="isDark" :rail-style="railStyle">
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
        target="_blank"
      >
        <div class="i-uil:github text-8"></div>
      </a>
    </NSpace>
    <div
      class="lg:display-none p-1 box-border rounded-1 cursor-pointer hover:bg-background hover:dark:bg-darkbackground-light"
    >
      <NDropdown trigger="click" :options="dropdownItems" @select="onDropdownItem">
        <div class="i-uil:align-right text-5"></div>
      </NDropdown>
    </div>
  </header>
  <ChangelogDialog v-model="showChangelog" />
</template>

<script setup lang="ts">
import { NButton, NDropdown, NPopover, NSpace, NSwitch } from "naive-ui";
import type { CSSProperties } from "vue";
import ChangelogDialog from "@/components/change-log/ChangelogDialog.vue";
import { useAppStore } from "@/store/app-store";
import { colorBackground, colorDarkBackground, colorPrimary } from "@/style/theme";
import { version } from "~/package.json";

let showChangelog = $ref(false);

const appStore = useAppStore();
let { headerHeight, sidebarWidth, autoAdjust, isDark } = $(appStore);

const railStyle = ({ focused, checked }: { focused: boolean; checked: boolean }) => {
  const style: CSSProperties = {};
  if (isDark) {
    if (checked) {
      style.background = colorDarkBackground.dark;
      if (focused) { style.boxShadow = `0 0 0 2px ${colorDarkBackground.lighter}`; }
    } else {
      style.background = colorDarkBackground.light;
      if (focused) { style.boxShadow = `0 0 0 2px ${colorDarkBackground.lighter}`; }
    }
  } else {
    if (checked) {
      style.background = colorPrimary.DEFAULT;
      if (focused) { style.boxShadow = `0 0 0 2px ${colorPrimary.lighter}`; }
    } else {
      style.background = colorBackground.dark;
      if (focused) { style.boxShadow = `0 0 0 2px ${colorPrimary.lighter}`; }
    }
  }
  return style;
};

const dropdownItems = $computed(() => [
  {
    label: `v${version}`,
    key: "version",
  },
  // {
  //   label: `${autoAdjust ? "关闭" : "开启"}自适应缩放`,
  //   key: "autoAdjust",
  // },
  {
    label: `切换至${isDark ? "亮色☀️" : "暗色🌙"}`,
    key: "appearance",
  },
  {
    label: "去Github看看👀",
    key: "github",
  },
]);
const onDropdownItem = (key: string) => {
  switch (key) {
    case "version":
      showChangelog = true;
      break;
    case "autoAdjust":
      autoAdjust = !autoAdjust;
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

.divide-vertical {
  @apply h-5 w-[1px] bg-default-lighter;
}
</style>
