import { defineStore } from "pinia";

export const useAppStore = defineStore("app", () => {
  const sidebarWidth = $ref("280px");
  const headerHeight = $ref("60px");

  return $$({
    sidebarWidth,
    headerHeight,
  });
});
