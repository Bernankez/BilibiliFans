import type { AvailableLocales } from "@/utils/i18n";

export const useAppStore = defineStore("app", () => {
  const locale = ref<AvailableLocales>();
  const split = ref(false);
  const splitRatio = ref(0.5);

  return {
    locale,
    split,
    splitRatio,
  };
}, {
  persist: true,
});
