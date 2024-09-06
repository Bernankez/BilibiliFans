export function usePost() {
  const templateStore = useTemplateStore();
  const { currentTemplate } = storeToRefs(templateStore);
  const userStore = useUserStore();
  const { no } = storeToRefs(userStore);

  const matches = computed(() => [
    ["name", currentTemplate.value?.copywriting.name],
    ["no", no.value.toString().padStart(6, "0")],
    ["link", currentTemplate.value?.copywriting.link],
  ]);

  const post = computed(() => {
    if (currentTemplate.value) {
      let post = currentTemplate.value.copywriting.post || "";
      matches.value.forEach(([key, value]) => {
        post = post.replace(`$\{${key}\}`, value?.toString() ?? "");
      });
      return post;
    }
    return "";
  });

  return {
    post,
  };
}
