<script setup lang="ts">
const nickname = ref("");
</script>

<template>
  <div>Hello</div>
  <div>
    <NInput v-model:value="nickname" />
  </div>
  <!-- <FansCard :nickname /> -->
</template>
