<template>
  <div class="sidebar">
    <NColorPicker :modes="['hex']" :showAlpha="false" :showPreview="true"></NColorPicker>
    <!-- <NButton @click="onSnapshot">生成</NButton> -->
  </div>
</template>

<script setup lang="ts">
import { NColorPicker, NButton } from "naive-ui";
</script>

<style lang="scss" scoped>
.sidebar {
  @apply shrink-0 h-full w-70 p-3 box-border;
  box-shadow: -1px 0 10px 0px #eee;
}
</style>
