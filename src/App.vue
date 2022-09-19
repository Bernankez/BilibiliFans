<template>
  <NConfigProvider :locale="zhCN" :dateLocale="dateZhCN" abstract>
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

<script setup lang="ts">
import Header from "@/components/layout/Header.vue";
import Main from "@/components/layout/Main.vue";
import Sidebar from "@/components/layout/Sidebar.vue";
import { NConfigProvider, NDialogProvider, NMessageProvider, zhCN, dateZhCN } from "naive-ui";

const mainEl = $ref<typeof Main>();
const onGenerate = () => {
  mainEl?.generate();
};
</script>
