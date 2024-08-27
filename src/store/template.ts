import { defineStore } from "pinia";
import { klona } from "klona";
import { useIDBKeyval } from "@vueuse/integrations/useIDBKeyval";
/**
 * @see https://github.com/microsoft/TypeScript/issues/47663#issuecomment-1519138189
 */
// eslint-disable-next-line unused-imports/no-unused-imports
import type { RemovableRef } from "@vueuse/shared";
import type { TemplateManifest } from "@/types/template";
import { resolveDefaultTemplates } from "@/templates";

export const useTemplateStore = defineStore("template", () => {
  const defaultTemplates = ref<TemplateManifest<string>[]>([]);
  const { data: customTemplates, isFinished: resolvingCustomTemplates } = useIDBKeyval<TemplateManifest<Blob>[]>("bilifans-custom-template", []);
  const currentTemplate = ref<TemplateManifest<string | Blob>>();
  const resolvingDefaultTemplates = ref(true);
  const loading = computed(() => !resolvingCustomTemplates.value || resolvingDefaultTemplates.value);

  resolveDefaultTemplates().then((templates) => {
    defaultTemplates.value = templates;
    resolvingDefaultTemplates.value = false;
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
      const _customTemplate = customTemplates.value.find(item => item.id === id);
      if (_defaultTemplate) {
        currentTemplate.value = klona(_defaultTemplate);
      } else if (_customTemplate) {
        currentTemplate.value = klona(_customTemplate);
      }
    }
  }

  // loadTemplate("luyejiu");

  return {
    defaultTemplates,
    customTemplates,
    currentTemplate,
    loading,

    loadTemplate,
  };
});
