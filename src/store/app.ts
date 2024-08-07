import { defineStore } from "pinia";

export const useAppStore = defineStore("app", () => {
  const showSideBar = ref(false);
  const showActivityBar = ref(true);

  const rightSize = computed(() => {
    if (showSideBar.value && showActivityBar.value) {
      return `calc(var(--side-bar-width) + var(--activity-bar-width))`;
    }
    if (showSideBar.value) {
      return `var(--side-bar-width)`;
    }
    if (showActivityBar.value) {
      return `var(--activity-bar-width)`;
    }
    return "0";
  });

  return {
    showSideBar,
    showActivityBar,
    rightSize,
  };
});
