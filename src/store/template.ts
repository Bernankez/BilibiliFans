import { defineStore } from "pinia";
import { klona } from "klona";
import { useIDBKeyval } from "@vueuse/integrations/useIDBKeyval";
/**
 * @see https://github.com/microsoft/TypeScript/issues/47663#issuecomment-1519138189
 */
// eslint-disable-next-line unused-imports/no-unused-imports
import type { RemovableRef } from "@vueuse/shared";
import { nanoid } from "nanoid";
import type { TemplateManifest } from "@/types/template";
import { resolveDefaultTemplates } from "@/templates";
import { imageToBlob } from "@/utils/template";

export const useTemplateStore = defineStore("template", () => {
  const defaultTemplates = ref<TemplateManifest<string>[]>([]);
  const { data: customTemplates, isFinished: resolvingCustomTemplates } = useIDBKeyval<TemplateManifest<Blob>[]>("bilifans-custom-template", []);
  const { data: currentTemplate, isFinished: resolvingCurrentTemplate } = useIDBKeyval<TemplateManifest<Blob | string> | undefined>("bilifans-current-template", undefined);
  const resolvingDefaultTemplates = ref(true);
  const loading = computed(() => !resolvingCustomTemplates.value || resolvingDefaultTemplates.value || !resolvingCurrentTemplate.value);

  resolveDefaultTemplates().then((templates) => {
    defaultTemplates.value = templates;
    resolvingDefaultTemplates.value = false;
  });

  function loadTemplate(id: string) {
    if (currentTemplate.value?.id === id) {
      return;
    }

    const stop = watchEffect(() => {
      if (!loading.value) {
        nextTick(() => stop());
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

  async function addCustomTemplate(template: Omit<TemplateManifest<Blob | string>, "type" | "id">) {
    const backgroundImage = await imageToBlob(template.cardStyle.background.image);
    const targetTemplate: TemplateManifest<Blob> = {
      ...template,
      type: "custom",
      id: nanoid(),
      cardStyle: {
        ...template.cardStyle,
        background: {
          ...template.cardStyle.background,
          image: backgroundImage,
        },
      },
    };
    customTemplates.value.push(klona(targetTemplate));
  }

  function removeCustomTemplate(id: string) {
    customTemplates.value = klona(customTemplates.value.filter(item => item.id !== id));
  }

  return {
    defaultTemplates,
    customTemplates,
    currentTemplate,
    loading,

    loadTemplate,
    addCustomTemplate,
    removeCustomTemplate,
  };
});
