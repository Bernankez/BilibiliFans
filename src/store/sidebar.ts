export type Actions = "template" | "copywriting" | "card" | "user" | "setting";

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
