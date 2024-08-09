<script setup lang="ts">
import type { DropdownMixedOption } from "naive-ui/es/dropdown/src/interface";
import type { CSSProperties } from "vue";

const toggle = useToggle(isDark);
const { t, locale } = useI18n();

function railStyle({ focused }: { focused: boolean; checked: boolean }) {
  const style: CSSProperties = {};
  style.background = `rgb(var(--muted))`;
  if (focused) {
    style.boxShadow = `0 0 0 2px rgb(var(--primary))`;
  }
  return style;
}

function icon(i: string, as: "svg" | "emoji" = "svg") {
  if (as === "svg") {
    return () => {
      return h("div", {
        class: i,
      });
    };
  } else {
    return () => {
      return h("span", {
        class: "text-lg",
      }, i);
    };
  }
}

// @unocss-include
const langs = ref<DropdownMixedOption[]>([
  {
    icon: icon("🇨🇳", "emoji"),
    label: "简体中文",
    key: "zh-CN",
  },
  {
    icon: icon("🇺🇸", "emoji"),
    label: "English",
    key: "en-US",
  },
]);
</script>

<template>
  <header class="h-[var(--header-height)] flex items-center justify-between b-b-1 b-border b-solid p-2">
    <div>
    </div>
    <div class="flex items-center gap-3">
      <NDropdown placement="bottom-end" trigger="click" :options="langs" @select="key => locale = key">
        <NButton text>
          <component :is="langs.find(lang => lang.key === locale)?.icon" />
        </NButton>
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
