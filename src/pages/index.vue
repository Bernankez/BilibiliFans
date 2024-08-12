<script setup lang="ts">
const toggle = useToggle(isDark);
</script>

<template>
  <div>Hello</div>
  <div @click="() => toggle()">
    toggle
  </div>
  <FansCard />
</template>
