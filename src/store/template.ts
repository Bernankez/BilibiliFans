import { defineStore } from "pinia";
import type { TemplateManifest } from "@/types/template";
import { loadTemplate } from "@/templates";

export const useTemplateStore = defineStore("template", () => {
  const defaultTemplates = ref<{
    id: string;
    name: string;
    template?: TemplateManifest;
  }[]>([
    {
      id: "luyejiu",
      name: "鹿野灸",
    },
  ]);

  const currentTemplateId = ref<string>("luyejiu");
  const loading = ref(false);
  const currentTemplate = ref<TemplateManifest>();

  watch(currentTemplateId, async (id) => {
    const _template = defaultTemplates.value.find(t => t.id === id);
    if (_template) {
      loading.value = true;
      currentTemplate.value = await loadTemplate(id);
      loading.value = false;
    }
  }, { immediate: true });

  return {
    defaultTemplates: readonly(defaultTemplates),
    currentTemplateId,
    currentTemplate,
    loading,
  };
});
