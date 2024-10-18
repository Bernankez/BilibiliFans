import { enUS } from "@/locale/en-US";
import { zhCN } from "@/locale/zh-CN";
import { n } from "@bernankez/utils";
import { createI18n } from "vue-i18n";

export const availableLocales = n(["en-US", "zh-CN"]);
export type AvailableLocales = typeof availableLocales[number];
export const defaultLocale = "zh-CN";
export const fallbackLocale = "en-US";

export const i18n = createI18n({
  legacy: false,
  locale: defaultLocale,
  fallbackLocale,
  messages: {
    "zh-CN": zhCN,
    "en-US": enUS,
  },
});

export async function setLocale(locale: AvailableLocales) {
  i18n.global.locale.value = locale;
  const appStore = useAppStore();
  appStore.locale = locale;
  document.querySelector("html")?.setAttribute("lang", locale);
}

export function inferPreferredLocale(): AvailableLocales {
  const appStore = useAppStore();
  if (appStore.locale) {
    return appStore.locale;
  }
  const userLocale = (window.navigator.language || defaultLocale) as AvailableLocales;
  if (availableLocales.indexOf(userLocale) > 0) {
    return userLocale;
  }
  const userLocaleWithoutRegion = userLocale.split("-")[0] as AvailableLocales;
  const availableLocale = availableLocales.find(locale => locale.startsWith(userLocaleWithoutRegion));
  if (availableLocale) {
    return availableLocale;
  }
  return defaultLocale;
}
