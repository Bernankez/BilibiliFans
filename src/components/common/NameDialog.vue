<script setup lang="ts">
import type { TemplateManifest } from "@/types/template";
import type { FormItemInst, FormItemRule } from "naive-ui";

const props = defineProps<{
  template?: TemplateManifest<Blob | string>;
}>();

const emit = defineEmits<{
  (event: "confirm", name: string): void;
}>();

const show = defineModel<boolean>({
  default: false,
});

const { t } = useI18n();

const name = ref(props.template?.name);
watchEffect(() => {
  name.value = props.template?.name;
});

const formItemRef = ref<FormItemInst>();
const rule = ref<FormItemRule>({
  trigger: [],
  validator() {
    if (!name.value) {
      return new Error(t("app.interface.nameDialog.empty"));
    }
  },
});

async function confirm() {
  const res = await formItemRef.value?.validate().catch(() => false);
  if (!res) {
    return;
  }
  emit("confirm", name.value!);
  show.value = false;
}
</script>

<template>
  <NModal v-model:show="show" :title="t('app.interface.nameDialog.title')" preset="dialog">
    <NFormItem ref="formItemRef" :rule="rule">
      <NInput v-model:value="name" />
    </NFormItem>
    <template #action>
      <NButton size="small" @click="show = false">
        {{ t("app.interface.nameDialog.cancel") }}
      </NButton>
      <NButton size="small" type="primary" @click="confirm">
        {{ t("app.interface.nameDialog.confirm") }}
      </NButton>
    </template>
  </NModal>
</template>
