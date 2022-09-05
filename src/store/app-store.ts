import { CardOption } from "@/types";
import { defineStore } from "pinia";
import dayjs from "dayjs";
import { computed, Ref, ref, unref, UnwrapRef } from "vue";

export const useAppStore = defineStore("app", () => {
  const defaultOptions: CardOption = {
    backgroundColor: "#ffffff",
    backgroundImage: "",
    gradientColor: "#333333",
    gradientStart: "10%",
    gradientEnd: "30%",
    nickname: "",
    avatar: "",
    fansNo: "00001",
    customLink: "https://www.bilibili.com/h5/mall/home?navhide=1",
    article: computed(
      () =>
        `我是#${options.value.anchorName}#的NO.${options.value.fansNo}号真爱粉，靓号在手，走路带风，解锁专属粉丝卡片，使用专属粉丝装扮，你也来生成你的专属秀起来吧！${options.value.customLink}`
    ),
    anchorName: "",
    date: dayjs().format("YYYY/MM/DD"),
  };

  let options = ref<CardOption>(defaultOptions);

  function reset() {
    options.value = ref(defaultOptions).value;
  }

  return {
    options,
    reset,
  };
});
