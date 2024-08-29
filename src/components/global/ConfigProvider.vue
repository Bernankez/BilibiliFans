<script setup lang="ts">
import { darkTheme, dateEnUS, dateZhCN, enUS, lightTheme, zhCN } from "naive-ui";

const { locale } = useI18n();

const naiveLocale = computed(() => {
  switch (locale.value) {
    case "zh-CN":
      return zhCN;
    case "en-US":
      return enUS;
    default:
      return zhCN;
  }
});

const naiveDateLocale = computed(() => {
  switch (locale.value) {
    case "zh-CN":
      return dateZhCN;
    case "en-US":
      return dateEnUS;
    default:
      return dateZhCN;
  }
});
</script>

<template>
  <NConfigProvider abstract :theme="isDark ? darkTheme : lightTheme" :locale="naiveLocale" :date-locale="naiveDateLocale">
    <NMessageProvider placement="bottom-right">
      <NDialogProvider>
        <slot></slot>
      </NDialogProvider>
    </NMessageProvider>
  </NConfigProvider>
</template>
