import { CardOption } from "@/types";
import { defineStore } from "pinia";
import dayjs from "dayjs";

export const useAppStore = defineStore("app", () => {
  const defaultOptions: CardOption = {
    backgroundColor: "#fff",
    backgroundImage: "",
    gradientColor: "#333",
    gradientStart: "10%",
    gradientEnd: "30%",
    nickname: "",
    avatar: "",
    fansNo: "00001",
    date: dayjs().format("YYYY/MM/DD"),
  };

  let options = $ref<CardOption>(defaultOptions);

  function reset() {
    options = defaultOptions;
  }

  return $$({
    options,
    reset,
  });
});
