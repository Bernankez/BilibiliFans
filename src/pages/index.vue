<script setup lang="ts">
import Background from "@/assets/img/background.jpeg";
import Reference from "@/assets/img/reference.jpg";

const nickname = ref("科科Cole");
// const lock = ref(true);

const image = ref(Background);
function change() {
  image.value = image.value === Background ? Reference : Background;
}
</script>

<template>
  <div class="h-full flex items-center justify-center overflow-auto px-4">
    <!-- <NAffix class="absolute right-2 top-2" :trigger-top="32">
      <Button :icon="lock ? 'i-uil-padlock' : 'i-uil-lock-open-alt'" @click="lock = !lock" />
    </NAffix> -->
    <div class="max-w-200 w-full">
      <FansCard :nickname />
      <!-- <Cropper :img="image" :aspect-ratio="1 / 0.4115" /> -->
      <Button @click="change">
        ff
      </Button>
    </div>
  </div>
</template>
