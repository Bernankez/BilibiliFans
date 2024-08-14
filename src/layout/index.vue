<script setup lang="ts">
import Header from "./Header.vue";
import Sidebar from "./Sidebar/index.vue";
</script>

<template>
  <div class="h-full w-full flex">
    <div class="h-full w-0 flex flex-1 flex-col">
      <Header />
      <main class="h-full">
        <slot></slot>
      </main>
    </div>
    <Sidebar />
  </div>
</template>
