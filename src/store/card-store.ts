import dayjs from "dayjs";
import { defineStore } from "pinia";
import type { UnwrapRef } from "vue";
import { computed, ref } from "vue";
import type { CardOption, Quality } from "@/types";
import defaultAvatar from "@/assets/default/avatar.jpg";
import defaultBackground from "@/assets/default/background.jpeg";

export const useCardStore = defineStore("card", () => {
  function createReset(): CardOption {
    return {
      backgroundColor: "#ffffff",
      backgroundImage: "",
      gradient: true,
      gradientColor: "#eaba80",
      gradientStart: "19%",
      gradientEnd: "35%",
      gradientStartRight: "0%",
      gradientEndRight: "27%",
      nickname: "",
      avatar: "",
      fansNo: "000001",
      customLink: "https://www.bilibili.com/h5/mall/suit/detail?navhide=1&id=106232701&native.theme=1&night=0",
      article: computed(
        () =>
          `我是#${options.value.anchorName}#的NO.${options.value.fansNo}号真爱粉，靓号在手，走路带风，解锁专属粉丝卡片，使用专属粉丝装扮，你也来生成你的专属秀起来吧！${options.value.customLink}`,
      ),
      anchorName: "",
      date: "2023-03-12",
      textColor: "#ffffff",
      boxInsideImage: true,
      imageScale: false,
      imageMove: false,
    };
  }

  let options = ref<CardOption>(createReset());

  function reset() {
    options.value = createReset() as UnwrapRef<CardOption>;
  }

  function setDefault() {
    options.value.avatar = defaultAvatar;
    options.value.backgroundImage = defaultBackground;
    options.value.nickname = "科科Cole";
    options.value.anchorName = "鹿野灸";
  }

  const baseFontSize = ref(16);

  const quality = $ref<Quality>("default");

  return {
    options,
    reset,
    setDefault,
    baseFontSize,
    quality,
  };
});
