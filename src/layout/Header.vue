<script setup lang="ts">
const toggle = useToggle(isDark);
</script>

<template>
  <header class="h-[var(--header-height)] flex items-center justify-between b-b-1 b-border b-solid p-2">
    <div></div>
    <div>
      <NButton circle text @click="() => toggle()">
        <div class="text-2xl" :class="[isDark ? 'i-uil-moon' : 'i-uil-sun']"></div>
      </NButton>
    </div>
  </header>
</template>
