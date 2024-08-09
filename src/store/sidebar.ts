export type Actions = "copywriting" | "styles";

export const useSidebarStore = defineStore("sidebar", () => {
  const show = ref(false);
  const activeAction = ref<Actions>();

  return {
    show,
    activeAction,
  };
}, {
  persist: true,
});
