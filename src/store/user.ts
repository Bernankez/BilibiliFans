export const useUserStore = defineStore("user", () => {
  const nickname = ref("");
  const avatar = ref("");
  const no = ref(1);

  return {
    nickname,
    avatar,
    no,
  };
}, {
  persist: {
    pick: ["nickname", "avatar"],
  },
});
