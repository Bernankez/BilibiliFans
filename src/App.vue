<template>
  <ConfigProvider>
    <div class="layout">
      <div class="content">
        <Header></Header>
        <div class="main">
          <Main ref="mainEl"></Main>
        </div>
      </div>
      <Sidebar @generate="onGenerate"></Sidebar>
    </div>
  </ConfigProvider>
</template>

<script setup lang="ts">
import Header from "@/components/layout/Header.vue";
import Main from "@/components/layout/Main.vue";
import Sidebar from "@/components/layout/Sidebar.vue";
import ConfigProvider from "./components/layout/ConfigProvider.vue";
import { useAppStore } from "./store/app-store";
import { colorPrimary, colorDisabled } from "@/style/theme";

const appStore = useAppStore();
const { sidebarWidth } = $(appStore);

const mainEl = $ref<typeof Main>();
const onGenerate = () => {
  mainEl?.generate();
};
</script>

<style>
::selection {
  background-color: v-bind("colorPrimary.DEFAULT");
  color: #fff;
}

::-webkit-scrollbar {
  height: 13px;
  width: 13px;
  box-shadow: inset 0 0 5px v-bind("colorDisabled.light");
}

::-webkit-scrollbar-thumb {
  border-radius: 999px;
  border-style: dashed;
  border-color: transparent;
  border-width: 2px;
  background-color: v-bind("colorDisabled.light");
  background-clip: padding-box;
  transition: all 0.2s ease-in-out;
}

::-webkit-scrollbar-thumb:hover {
  background: v-bind("colorDisabled.DEFAULT");
  cursor: pointer;
  transition: all 0.2s ease-in-out;
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
