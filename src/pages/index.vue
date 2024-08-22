<script setup lang="ts">
import { breakpointsTailwind } from "@vueuse/core";
import Background from "@/assets/img/background.jpeg";

const { t } = useI18n();
const appStore = useAppStore();
const { split, splitRatio } = storeToRefs(appStore);

const { sm } = useBreakpoints(breakpointsTailwind);

const nickname = ref("科科Cole");
const mode = ref<"preview" | "edit">("preview");

const image = ref(Background);

const origin = ref<[number, number]>();
const size = ref<[number, number]>();

function onCropperChange(_origin: [number, number], _size: [number, number]) {
  origin.value = _origin;
  size.value = _size;
}
</script>

<template>
  <div class="relative h-full w-full flex items-center justify-center overflow-hidden">
    <div class="absolute right-2 top-2 z-1 flex items-center gap-2 rounded-full bg-background bg-opacity-50 p-1.5 shadow transition hover:bg-opacity-100">
      <template v-if="!split">
        <NTooltip v-if="mode !== 'preview'" placement="bottom">
          <template #trigger>
            <NButton secondary circle @click="mode = 'preview'">
              <template #icon>
                <div class="i-material-symbols-id-card-outline-rounded"></div>
              </template>
            </NButton>
          </template>
          <span>{{ t("app.interface.togglePreview") }}</span>
        </NTooltip>
        <NTooltip v-if="mode !== 'edit'" placement="bottom">
          <template #trigger>
            <NButton secondary circle @click="mode = 'edit'">
              <template #icon>
                <div class="i-material-symbols-crop-rounded"></div>
              </template>
            </NButton>
          </template>
          <span>{{ t("app.interface.toggleEdit") }}</span>
        </NTooltip>
        <NTooltip placement="bottom">
          <template #trigger>
            <NButton secondary circle @click="split = true">
              <template #icon>
                <div :class="sm ? 'i-material-symbols-view-column-2-outline' : 'i-material-symbols-view-agenda-outline'"></div>
              </template>
            </NButton>
          </template>
          <span>{{ t("app.interface.splitWindow") }}</span>
        </NTooltip>
      </template>
      <NTooltip v-else placement="bottom">
        <template #trigger>
          <NButton secondary circle @click="split = false">
            <template #icon>
              <div class="i-material-symbols-crop-7-5-outline"></div>
            </template>
          </NButton>
        </template>
        <span>{{ t("app.interface.mergeWindow") }}</span>
      </NTooltip>
    </div>
    <template v-if="!split">
      <Transition name="card">
        <div v-show="mode === 'preview'" class="max-w-200 w-full p-4">
          <FansCard :nickname />
        </div>
      </Transition>
      <Transition name="card">
        <div v-show="mode === 'edit'" class="h-full max-w-200 w-full flex items-center p-4">
          <Cropper :origin :size class="max-h-full w-full" :img="image" :min-width="64" :aspect-ratio="1 / 0.4115" @change="onCropperChange" />
        </div>
      </Transition>
    </template>
    <!-- Split View -->
    <NSplit v-else v-model:size="splitRatio" :max="0.7" :min="0.3" :direction="sm ? 'horizontal' : 'vertical'">
      <template #1>
        <div class="h-full flex items-center justify-center">
          <div class="max-w-200 w-full p-4">
            <FansCard :nickname />
          </div>
        </div>
      </template>
      <template #2>
        <div class="h-full flex items-center justify-center">
          <div class="h-full max-w-200 w-full flex items-center p-4">
            <Cropper :origin :size class="max-h-full w-full" :img="image" :min-width="64" :aspect-ratio="1 / 0.4115" @change="onCropperChange" />
          </div>
        </div>
      </template>
    </NSplit>
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
