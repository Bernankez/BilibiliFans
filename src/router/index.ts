import { type RouteRecordRaw, createRouter, createWebHistory } from "vue-router";

export const routes: RouteRecordRaw[] = [
  {
    path: "/",
    component: () => import("../pages/index.vue"),
  },
];

export const router = createRouter({
  history: createWebHistory(),
  routes,
});
