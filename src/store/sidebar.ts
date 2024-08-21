export type Actions = "template" | "copywriting" | "card" | "user";

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
