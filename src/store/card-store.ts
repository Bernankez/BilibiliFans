import dayjs from "dayjs";
import { defineStore } from "pinia";
import type { UnwrapRef } from "vue";
import { computed, ref } from "vue";
import type { CardOption, Quality } from "@/types";
import defaultAvatar from "@/assets/default/avatar.jpg";
import defaultBackground from "@/assets/default/background.png";

export const useCardStore = defineStore("card", () => {
  function createReset(): CardOption {
    return {
      backgroundColor: "#ffffff",
      backgroundImage: "",
      gradient: true,
      gradientColor: "#FFE4C5",
      gradientStart: "0%",
      gradientEnd: "32%",
      nickname: "",
      avatar: "",
      fansNo: "000001",
      customLink: "https://www.bilibili.com/h5/mall/home?navhide=1",
      article: computed(
        () =>
          `我是#${options.value.anchorName}#的NO.${options.value.fansNo}号真爱粉，靓号在手，走路带风，解锁专属粉丝卡片，使用专属粉丝装扮，你也来生成你的专属秀起来吧！${options.value.customLink}`,
      ),
      anchorName: "",
      date: dayjs().format("YYYY/MM/DD"),
      textColor: "#27272A",
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
