import type { AvailableLocales } from "@/utils/i18n";

export const useAppStore = defineStore("app", () => {
  const locale = ref<AvailableLocales>();
  const split = ref(false);
  const splitRatio = ref(0.5);

  const imageSizeRef = ref(50);
  const imageWidth = computed(() => Math.round(1093 * imageSizeRef.value / 50));
  const imageHeight = computed(() => Math.round(imageWidth.value * 0.4115));
  const imageSize = computed(() => [imageWidth.value, imageHeight.value]);

  return {
    locale,
    split,
    splitRatio,

    imageSize,
    imageSizeRef,
  };
}, {
  persist: true,
});
