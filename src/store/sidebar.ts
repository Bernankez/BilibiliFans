export const useSidebarStore = defineStore("sidebar", () => {
  const show = ref(false);
  const activeAction = ref<string>("share");

  return {
    show,
    activeAction,
  };
});
