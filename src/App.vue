<script setup lang="ts">
import Sidebar from "@/components/Sidebar.vue";
import FansCard from "./components/FansCard.vue";
</script>

<template>
  <div class="flex w-full h-full">
    <main class="flex justify-center items-center w-full h-full bg-background">
      <FansCard></FansCard>
    </main>
    <Sidebar></Sidebar>
  </div>
</template>

<style scoped></style>
