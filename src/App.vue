<template>
  <ConfigProvider>
    <div class="layout">
      <div class="content">
        <Header></Header>
        <div class="main">
          <Main ref="mainEl"></Main>
        </div>
      </div>
      <Sidebar @generate="onGenerate" @reset-cropper="onResetCropper"></Sidebar>
    </div>
  </ConfigProvider>
</template>

<script setup lang="ts">
import Header from "@/components/layout/Header.vue";
import Main from "@/components/layout/Main.vue";
import Sidebar from "@/components/layout/Sidebar.vue";
import ConfigProvider from "./components/layout/ConfigProvider.vue";
import { useAppStore } from "./store/app-store";
import { colorPrimary, colorDisabled, colorBackground, colorDarkBackground } from "@/style/theme";

const appStore = useAppStore();
const { sidebarWidth } = $(appStore);

const mainEl = $ref<typeof Main>();
const onGenerate = () => {
  mainEl?.generate();
};

const onResetCropper = () => {
  mainEl?.resetCropper();
};
</script>

<style lang="scss">
::selection {
  background-color: v-bind("colorPrimary.DEFAULT");
  color: #fff;
}

::-webkit-scrollbar {
  height: 13px;
  width: 13px;
  box-shadow: inset 0 0 5px v-bind("colorDisabled.light");
  background-color: v-bind("colorBackground.lighter");

  .dark & {
    background-color: v-bind("colorDarkBackground.darker");
    box-shadow: unset;
  }
}

::-webkit-scrollbar-thumb {
  border-radius: 999px;
  border-style: dashed;
  border-color: transparent;
  border-width: 2px;
  background-color: v-bind("colorDisabled.light");
  background-clip: padding-box;

  .dark & {
    background-color: v-bind("colorDarkBackground.light");
  }
}

::-webkit-scrollbar-thumb:hover {
  background: v-bind("colorDisabled.DEFAULT");
  cursor: pointer;

  .dark & {
    background-color: v-bind("colorDarkBackground.lighter");
  }
}

#app {
  width: 100vw;
  height: 100vh;
  overflow: hidden;
}
</style>

<style lang="scss" scoped>
.layout {
  @apply flex w-full h-full;
}

.content {
  @apply h-full;
  width: calc(100% - v-bind("sidebarWidth"));
}

.main {
  @apply h-full overflow-x-auto;
}
</style>
