<template>
  <NConfigProvider :locale="zhCN" :dateLocale="dateZhCN" abstract>
    <NMessageProvider>
      <NDialogProvider>
        <slot></slot>
      </NDialogProvider>
    </NMessageProvider>
  </NConfigProvider>
</template>

<script setup lang="ts">
import { NConfigProvider, NMessageProvider, NDialogProvider, zhCN, dateZhCN } from "naive-ui";
</script>
