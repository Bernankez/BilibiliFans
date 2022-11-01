import { defineStore } from "pinia";

const APPEARANCE_KEY = "bilibili-fans-theme-appearance";
const AUTO_ADJUST_KEY = "bilibili-fans-auto-adjust";

export const useAppStore = defineStore("app", () => {
  const sidebarWidth = $ref("280px");
  const headerHeight = $ref("60px");
  const sidebarFixedHeight = $ref("270px");
  let _autoAdjust = $ref(false);
  const autoAdjust = $computed({
    get() {
      return _autoAdjust;
    },
    set(v: boolean) {
      localStorage.setItem(AUTO_ADJUST_KEY, JSON.stringify(v));
      _autoAdjust = v;
    },
  });
  _autoAdjust = localStorage.getItem(AUTO_ADJUST_KEY) ? JSON.parse(localStorage.getItem(AUTO_ADJUST_KEY)!) : _autoAdjust;

  const preferDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
  const saved = localStorage.getItem(APPEARANCE_KEY);
  let _isDark = $ref(false);
  let isDark = $computed({
    get() {
      return _isDark;
    },
    set(v: boolean) {
      const html = document.documentElement;
      const preferDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
      if (v) {
        html.classList.add("dark");
        if (preferDark) { localStorage.setItem(APPEARANCE_KEY, "auto"); } else { localStorage.setItem(APPEARANCE_KEY, "dark"); }
      } else {
        html.classList.remove("dark");
        if (preferDark) { localStorage.setItem(APPEARANCE_KEY, "light"); } else { localStorage.setItem(APPEARANCE_KEY, "auto"); }
      }
      _isDark = v;
    },
  });
  isDark = !saved || saved === "auto" ? preferDark : saved === "dark";

  return $$({
    sidebarWidth,
    sidebarFixedHeight,
    headerHeight,
    autoAdjust,
    isDark,
  });
});
