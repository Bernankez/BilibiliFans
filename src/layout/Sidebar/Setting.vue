<script setup lang="ts">
import { setLocale } from "@/utils/i18n";
import type { AvailableLocales } from "@/utils/i18n";
import type { DropdownOption } from "naive-ui";
import type { CSSProperties } from "vue";
import { version } from "~/package.json";

const toggle = useToggle(isDark);

const { t, locale } = useI18n();
const router = useRouter();
const appStore = useAppStore();
const { imageSize, imageSizeRef } = storeToRefs(appStore);

const showChangelog = ref(false);

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

const marks = computed(() => ({
  24: t("action.setting.form.quality.small"),
  50: t("action.setting.form.quality.medium"),
  92: t("action.setting.form.quality.large"),
}));

function formatTooltip(n: number) {
  const points = Object.keys(marks.value).map(v => Number(v));
  points.sort();
  let cur = marks.value[points[0] as keyof typeof marks.value];
  for (const i of points) {
    if (n > i) {
      cur = marks.value[i as keyof typeof marks.value];
    } else {
      break;
    }
  }
  return cur;
}

// @unocss-include
const dropdownOptions = computed<DropdownOption[]>(() => [
  {
    label: t("changelog.title"),
    key: "changelog",
  },
  {
    label: () => h("div", {
      class: "flex items-center gap-2",
    }, [
      h("span", t("changelog.legacy.v0")),
      h("div", {
        class: "i-uil-external-link-alt",
      }),
    ]),
    key: "v0",
  },
]);

function onDropdown(key: string) {
  switch (key) {
    case "changelog":
      showChangelog.value = true;
      break;
    case "v0":
      window.open("https://bilibili-fans-8pzyemay2-bernankez.vercel.app", "_blank");
      break;
  }
}
</script>

<template>
  <div>
    <NH2>{{ t('action.setting.title') }}</NH2>
    <NForm label-width="auto">
      <ActionFormItem :label="`${t('action.setting.form.quality.title')}（${imageSize[0]} x ${imageSize[1]}）`">
        <NSlider v-model:value="imageSizeRef" :min="1" :max="100" :marks :step="1" :format-tooltip />
      </ActionFormItem>
      <ActionFormItem>
        <template #label>
          <div class="w-full flex items-center justify-between">
            <div>{{ t('action.setting.form.language.title') }}</div>
            <NDropdown placement="bottom-end" trigger="click" :options="langs" @select="switchLocale">
              <Button :icon="langs.find(lang => lang.key === locale)?.icon" :auto-collapse="false" />
            </NDropdown>
          </div>
        </template>
      </ActionFormItem>
      <ActionFormItem>
        <template #label>
          <div class="w-full flex items-center justify-between">
            <div>{{ t("action.setting.form.theme.title") }}</div>
            <NTooltip placement="left">
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
        </template>
      </ActionFormItem>
      <ActionFormItem>
        <div class="flex items-center justify-end gap-1">
          <NDropdown trigger="click" :options="dropdownOptions" placement="bottom-end" @select="onDropdown">
            <Button class="text-lg">
              v{{ version }}
            </Button>
          </NDropdown>
          <a href="https://github.com/Bernankez/BilibiliFans" target="_blank">
            <div class="i-uil-github text-3xl transition hover:text-primary"></div>
          </a>
        </div>
      </ActionFormItem>
    </NForm>
    <ChangelogDialog v-model:show="showChangelog" />
  </div>
</template>
