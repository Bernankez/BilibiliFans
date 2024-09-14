<script setup lang="ts">
import { accept, exportTemplate, importTemplate } from "@/utils/template";
import type { TemplateManifest } from "@/types/template";
import type { SelectGroupOption, SelectOption } from "naive-ui";

const { t } = useI18n();
const message = useMessage();

const templateStore = useTemplateStore();
const { defaultTemplates, customTemplates, loading } = storeToRefs(templateStore);
const userStore = useUserStore();
const { nickname, avatar } = storeToRefs(userStore);

const id = ref<string | null>(null);

const { open, reset, onChange } = useFileDialog({
  accept,
});

onChange(async (files) => {
  if (!files?.[0].name.endsWith(accept)) {
    message.error(t("action.template.import.error.invalidFile"));
    return;
  }
  const file = files[0];
  const template = await importTemplate(file);
  if (template) {
    customTemplates.value.push(template);
  }
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
    children: customTemplates.value,
  },
]);
const template = computed(() => [...defaultTemplates.value, ...customTemplates.value].find(item => item.id === id.value));
const currentTemplate = ref<TemplateManifest<Blob | string>>();
watch(template, (template) => {
  if (template) {
    currentTemplate.value = template;
  } else {
    currentTemplate.value = undefined;
  }
});

function rename() {
  if (template.value && currentTemplate.value) {
    template.value.name = currentTemplate.value.name;
  }
}

function onDelete() {
  if (template.value) {
    templateStore.removeCustomTemplate(template.value.id);
    id.value = null;
  }
}

const exporting = ref(false);
async function onExport() {
  if (template.value) {
    exporting.value = true;
    const blob = await exportTemplate(template.value);
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${template.value.name}${accept}`;
    a.click();
    URL.revokeObjectURL(url);
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
        <NSelect v-model:value="id" :loading clearable label-field="name" value-field="id" :options />
        <template v-if="currentTemplate">
          <DemoFansCard :template="currentTemplate" :nickname :avatar />
          <div v-if="currentTemplate.type !== 'default'" class="flex gap-2">
            <NInput v-model:value="currentTemplate.name" />
            <NButton secondary type="primary" @click="rename">
              {{ t('action.template.rename.title') }}
            </NButton>
          </div>
          <div class="flex gap-2">
            <NPopconfirm v-if="currentTemplate.type !== 'default'" placement="bottom-start" :positive-text="t('action.template.delete.confirmText')" @positive-click="onDelete">
              <template #trigger>
                <NButton class="flex-1" secondary type="error">
                  {{ t('action.template.delete.title') }}
                </NButton>
              </template>
              {{ t('action.template.delete.confirm') }}
            </NPopconfirm>
            <NButton :loading="exporting" class="flex-1" secondary type="primary" @click="onExport">
              {{ t('action.template.export.title') }}
            </NButton>
          </div>
        </template>
      </div>
    </NForm>
  </div>
</template>
