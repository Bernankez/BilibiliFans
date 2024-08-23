<script setup lang="ts">
import type { DropdownOption } from "naive-ui";
import type { AvailableLocales } from "@/utils/i18n";
import { setLocale } from "@/utils/i18n";

const { t, locale } = useI18n();
const router = useRouter();

async function switchLocale(val: AvailableLocales) {
  await setLocale(val);
  try {
    await router.replace({ params: { locale: val } });
  } catch (e) {
    console.error(e);
    router.push("/");
  }
}

// @unocss-include
const langs = ref<DropdownOption[]>([
  {
    label: "简体中文",
    key: "zh-CN",
    icon: renderIcon("🇨🇳", "text"),
  },
  {
    label: "English",
    key: "en-US",
    icon: renderIcon("🇺🇸", "text"),
  },
]);

function renderIcon(icon: string, as: "icon" | "text" = "icon") {
  if (as === "icon") {
    return () => h("div", {
      class: `${icon} text-2xl`,
    });
  }
  return () => icon;
}
</script>

<template>
  <div>
    <NH2>{{ t('action.setting.title') }}</NH2>
    <NForm label-width="auto">
      <ActionFormItem>
        <template #label>
          <div class="w-full flex items-center justify-between">
            <div>{{ t('action.setting.form.language') }}</div>
            <NDropdown placement="bottom-end" trigger="click" :options="langs" @select="switchLocale">
              <Button :icon="langs.find(lang => lang.key === locale)?.icon" :auto-collapse="false" />
            </NDropdown>
          </div>
        </template>
      </ActionFormItem>
    </NForm>
  </div>
</template>
