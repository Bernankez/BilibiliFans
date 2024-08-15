import type { AvailableLocales } from "@/utils/i18n";

export const useAppStore = defineStore("app", () => {
  const locale = ref<AvailableLocales>();

  return {
    locale,
  };
}, {
  persist: true,
});
