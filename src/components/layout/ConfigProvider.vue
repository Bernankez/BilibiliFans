<template>
  <NConfigProvider :theme="isDark ? darkTheme : undefined" :locale="zhCN" :dateLocale="dateZhCN" abstract>
    <NMessageProvider>
      <NDialogProvider>
        <slot></slot>
      </NDialogProvider>
    </NMessageProvider>
  </NConfigProvider>
</template>

<script setup lang="ts">
import { useAppStore } from "@/store/app-store";
import { darkTheme, dateZhCN, NConfigProvider, NDialogProvider, NMessageProvider, zhCN } from "naive-ui";

const appStore = useAppStore();
const { isDark } = $(appStore);
</script>
