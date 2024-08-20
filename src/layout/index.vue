<script setup lang="ts">
import Header from "./Header.vue";
import Sidebar from "./Sidebar/index.vue";
</script>

<template>
  <div class="h-full w-full flex">
    <div class="w-0 flex-1 flex-col">
      <Header />
      <main class="h-[calc(100%_-_var(--header-height))] overflow-auto">
        <slot></slot>
      </main>
    </div>
    <Sidebar class="z-10" />
  </div>
</template>
