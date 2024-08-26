import { defineStore } from "pinia";
import { klona } from "klona";
import type { TemplateManifest } from "@/types/template";
import { resolveDefaultTemplates } from "@/templates";

export const useTemplateStore = defineStore("template", () => {
  const defaultTemplates = ref<TemplateManifest<string>[]>([]);
  // TODO store using localforage
  // const customTemplates = ref<TemplateSelectItem<Blob>[]>([]);
  // TODO store using localforage
  const currentTemplate = ref<TemplateManifest<string | Blob>>();
  const loading = ref(true);

  resolveDefaultTemplates().then((templates) => {
    defaultTemplates.value = templates;
    loading.value = false;
  });

  function loadTemplate(id: string) {
    if (currentTemplate.value?.id === id) {
      return;
    }

    const stop = watchEffect(() => {
      if (defaultTemplates.value.length) {
        nextTick(stop);
        setTemplate();
      }
    });

    function setTemplate() {
      const _defaultTemplate = defaultTemplates.value.find(item => item.id === id);
      if (_defaultTemplate) {
        currentTemplate.value = klona(_defaultTemplate);
      }
    }
  }

  // loadTemplate("luyejiu");

  return {
    defaultTemplates,
    currentTemplate,
    loading,

    loadTemplate,
  };
});
