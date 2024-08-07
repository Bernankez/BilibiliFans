<script setup lang="ts">
import { darkTheme, lightTheme } from "naive-ui";
</script>

<template>
  <NConfigProvider abstract :theme="isDark ? darkTheme : lightTheme">
    <slot></slot>
  </NConfigProvider>
</template>
