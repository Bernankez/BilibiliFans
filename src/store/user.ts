export const useUserStore = defineStore("user", () => {
  const nickname = ref("");
  const avatar = ref("");
  const no = ref(1);
  const date = ref<string>();

  return {
    nickname,
    avatar,
    no,
    date,
  };
}, {
  persist: {
    paths: ["nickname", "avatar"],
  },
});
