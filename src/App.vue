<script setup lang="ts">
import Layout from "./layout/index.vue";
</script>

<template>
  <ConfigProvider>
    <Layout>
      <RouterView />
    </Layout>
  </ConfigProvider>
</template>
