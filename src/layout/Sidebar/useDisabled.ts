export function useDisabled() {
  const templateStore = useTemplateStore();

  const disabled = computed(() => !templateStore.currentTemplate);

  return {
    disabled,
  };
}
