<script setup lang="ts">
import Background from "@/assets/img/background.jpeg";

const nickname = ref("科科Cole");
const lock = ref(true);

const image = ref(Background);
</script>

<template>
  <div class="relative h-full w-full flex items-center justify-center overflow-hidden">
    <div class="absolute right-2 top-2 z-1">
      <Button :icon="lock ? 'i-uil-padlock' : 'i-uil-lock-open-alt'" @click="lock = !lock" />
    </div>
    <Transition name="card">
      <div v-show="lock" class="max-w-200 w-full p-4">
        <FansCard :nickname />
      </div>
    </Transition>
    <Transition name="card">
      <div v-show="!lock" class="h-full max-w-200 w-full flex items-center p-4">
        <Cropper class="max-h-full w-full" :img="image" :min-width="64" :aspect-ratio="1 / 0.4115" />
      </div>
    </Transition>
  </div>
</template>

<style scoped>
.card-enter-active,
.card-leave-active {
  transition: opacity 0.5s ease;
}
.card-enter-from,
.card-leave-to {
  opacity: 0;
}

.card-enter-active,
.card-leave-active {
  position: absolute;
}
</style>
