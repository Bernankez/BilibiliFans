<script setup lang="ts">
import Header from "@/components/layout/Header.vue";
import Sidebar from "@/components/layout/Sidebar.vue";
import { dateZhCN, NConfigProvider, NDateLocale, NDialogProvider, NLocale, NMessageProvider, zhCN } from "naive-ui";
import Main from "@/components/layout/Main.vue";

const locale = $ref<NLocale>(zhCN);
const dateLocale = $ref<NDateLocale>(dateZhCN);

const mainEl = $ref<typeof Main>();
const onGenerate = () => {
  mainEl?.generate();
};

window.onbeforeunload = function (e) {
  return false;
};
</script>

<template>
  <NConfigProvider :locale="locale" :dateLocale="dateLocale" abstract>
    <div class="flex min-w-fit w-full h-full">
      <div class="relative min-w-fit w-full h-full">
        <Header></Header>
        <Main ref="mainEl"></Main>
      </div>
      <NMessageProvider>
        <NDialogProvider>
          <Sidebar @generate="onGenerate"></Sidebar>
        </NDialogProvider>
      </NMessageProvider>
    </div>
  </NConfigProvider>
</template>

<style lang="scss" scoped></style>
