<script setup lang="ts">
import type { CSSProperties } from "vue";
import type { DropdownOption } from "naive-ui";
import { type AvailableLocales, setLocale } from "@/utils/i18n";

const toggle = useToggle(isDark);
const { t, locale } = useI18n();
const router = useRouter();

function railStyle({ focused }: { focused: boolean; checked: boolean }) {
  const style: CSSProperties = {};
  style.background = `rgb(var(--muted))`;
  if (focused) {
    style.boxShadow = `0 0 0 2px rgb(var(--primary))`;
  }
  return style;
}

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
  <header class="h-[var(--header-height)] flex items-center justify-between b-b-1 b-border b-solid p-2">
    <div>
    </div>
    <div class="flex items-center gap-3">
      <NDropdown trigger="click" :options="langs" @select="switchLocale">
        <Button :icon="langs.find(lang => lang.key === locale)?.icon" :auto-collapse="false" />
      </NDropdown>
      <NTooltip>
        <template #trigger>
          <NSwitch :value="isDark" :rail-style="railStyle" @update:value="toggle">
            <template #unchecked-icon>
              <div class="i-uil:brightness"></div>
            </template>
            <template #checked-icon>
              <div class="i-uil:moon rotate-y-180"></div>
            </template>
          </NSwitch>
        </template>
        {{ isDark ? t('app.theme.dark') : t('app.theme.light') }}
      </NTooltip>
    </div>
  </header>
</template>
