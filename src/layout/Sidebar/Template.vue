<script setup lang="ts">
import type { SelectGroupOption, SelectOption } from "naive-ui";
import { klona } from "klona";
import type { TemplateManifest } from "@/types/template";
import { accept, exportTemplate, importTemplate } from "@/utils/template";

const { t } = useI18n();
const message = useMessage();

const templateStore = useTemplateStore();
const { defaultTemplates } = storeToRefs(templateStore);

const id = ref<string>();

const { open, reset, onChange } = useFileDialog({
  accept,
});

onChange((files) => {
  if (!files?.[0].name.endsWith(accept)) {
    message.error(t("action.template.import.error.invalidFile"));
    return;
  }
  const file = files[0];
  importTemplate(file);
});

const options = computed<(SelectOption | SelectGroupOption)[]>(() => [
  {
    type: "group",
    name: t("action.template.select.placeholder.default"),
    children: defaultTemplates.value,
  },
  {
    type: "group",
    name: t("action.template.select.placeholder.custom"),
    children: [
    ],
  },
]);
const template = computed(() => defaultTemplates.value.find(item => item.id === id.value));
const currentTemplate = ref<TemplateManifest<Blob | string>>();
watch(template, (template) => {
  if (template) {
    currentTemplate.value = klona(template);
  } else {
    currentTemplate.value = undefined;
  }
});

function rename() {
  if (template.value && currentTemplate.value) {
    template.value.name = currentTemplate.value.name;
  }
}

const exporting = ref(false);
async function onExport() {
  if (template.value) {
    exporting.value = true;
    await exportTemplate(template.value);
    exporting.value = false;
  }
}
</script>

<template>
  <div>
    <NH2>{{ t('action.template.title') }}</NH2>
    <NForm label-width="auto">
      <div class="flex flex-col">
        <NButton
          type="primary" @click="() => {
            reset();
            open()
          }"
        >
          {{ t('action.template.import.title') }}
        </NButton>
      </div>
      <NDivider />
      <div class="flex flex-col gap-4">
        <NSelect v-model:value="id" clearable label-field="name" value-field="id" :options />
        <template v-if="currentTemplate">
          <DemoFansCard :template="currentTemplate" nickname="xxxxxx" />
          <div v-if="currentTemplate.type !== 'default'" class="flex gap-2">
            <NInput v-model:value="currentTemplate.name" />
            <NButton quaternary type="primary" @click="rename">
              {{ t('action.template.rename.title') }}
            </NButton>
          </div>
          <div class="flex gap-2">
            <NButton v-if="currentTemplate.type !== 'default'" class="flex-1" quaternary type="error">
              {{ t('action.template.delete.title') }}
            </NButton>
            <NButton :loading="exporting" class="flex-1" quaternary type="primary" @click="onExport">
              {{ t('action.template.export.title') }}
            </NButton>
          </div>
        </template>
      </div>
    </NForm>
  </div>
</template>
