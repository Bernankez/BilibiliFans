<template>
  <NConfigProvider :theme="isDark ? darkTheme : undefined" :locale="zhCN" :date-locale="dateZhCN" abstract>
    <NMessageProvider>
      <NDialogProvider>
        <slot></slot>
      </NDialogProvider>
    </NMessageProvider>
  </NConfigProvider>
</template>

<script setup lang="ts">
import { NConfigProvider, NDialogProvider, NMessageProvider, darkTheme, dateZhCN, zhCN } from "naive-ui";
import { useAppStore } from "@/store/app-store";

const appStore = useAppStore();
const { isDark } = $(appStore);
</script>
