import { createApp } from "vue";
import "./style.css";
import piniaPluginPersistedstate from "pinia-plugin-persistedstate";
import { createI18n } from "vue-i18n";
import { createPinia } from "pinia";
import { router } from "./router";
import App from "./App.vue";
import "virtual:uno.css";
import "@unocss/reset/tailwind-compat.css";
import zhCN from "./locale/zh-CN";
import enUS from "./locale/en-US";

const i18n = createI18n<[typeof zhCN], "zh-CN" | "en-US">({
  legacy: false,
  locale: "zh-CN",
  fallbackLocale: "en-US",
  messages: {
    "zh-CN": zhCN,
    "en-US": enUS,
  },
});

const app = createApp(App);
const pinia = createPinia();
pinia.use(piniaPluginPersistedstate);
app.use(i18n);
app.use(router);
app.use(pinia);
app.mount("#app");
