import { type RouteRecordRaw, RouterView, createRouter, createWebHistory } from "vue-router";
import { type AvailableLocales, i18n, inferPreferredLocale, setLocale } from "@/utils/i18n";

export const routes: RouteRecordRaw[] = [
  {
    path: "/:locale?",
    component: RouterView,
    beforeEnter: async (to, from, next) => {
      const lang = to.params.locale as AvailableLocales;
      if (!i18n.global.availableLocales.includes(lang)) {
        return next(inferPreferredLocale());
      }

      await setLocale(lang);

      return next();
    },
    children: [
      {
        path: "",
        component: () => import("../pages/index.vue"),
      },
    ],
  },
];

export const router = createRouter({
  history: createWebHistory(),
  routes,
});
