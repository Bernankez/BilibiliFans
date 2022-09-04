<template>
  <div ref="fansCardEl" class="fans-card">
    <div class="absolute right-0 top-0">
      <slot name="image"></slot>
    </div>
    <div class="background"></div>
    <div class="relative h-full flex flex-col justify-between h-full">
      <div class="flex">
        <img class="avatar" :src="avatar" />
        <span class="user-name">{{ nickname }}</span>
      </div>
      <div class="m-t-[17px]">
        <div class="fans-mono">FANS NO.</div>
        <div class="fans-number kenny-mini">{{ fansNo }}</div>
      </div>
      <div class="m-t-[1px]">
        <div class="fans-mono">DATE</div>
        <div class="fans-date">{{ date }}</div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import dayjs from "dayjs";
import html2canvas from "html2canvas";

const {
  avatar = "",
  nickname = "",
  fansNo = "000001",
  date = dayjs().format("YYYY/MM/DD"),
  backgroundColor = "#fff",
  gradientColor = "#333",
  gradientStart = "10%",
  gradientEnd = "40%",
} = defineProps<{
  avatar?: string;
  nickname?: string;
  fansNo?: string;
  date?: string;
  backgroundColor?: string;
  gradientColor?: string;
  gradientStart?: string;
  gradientEnd?: string;
}>();

const fansCardEl = $ref<HTMLElement>();
function snapshot() {
  return html2canvas(fansCardEl).then(canvas => {
    document.body.appendChild(canvas);
  });
}

defineExpose({
  snapshot,
});
</script>

<style lang="scss" scoped>
.fans-card {
  position: relative;
  padding: 14px 18px 9px 18px;
  box-sizing: border-box;
  height: 200px;
  width: 486px;
  border-radius: 6px;
  background-color: v-bind("backgroundColor");
  box-shadow: 0 0 5px 2px #ccc;
  overflow: hidden;
}

.background {
  position: absolute;
  z-index: 0;
  left: 0;
  top: 0;
  height: 100%;
  background: linear-gradient(
    to right,
    v-bind("gradientColor") v-bind("gradientStart"),
    transparent v-bind("gradientEnd")
  );
  width: 100%;
}

@font-face {
  font-family: "kenny mini";
  src: url("../assets/fonts/Kenney-Mini-Square.ttf");
}

.avatar {
  width: 31px;
  height: 31px;
  border-radius: 999px;
  object-fit: cover;
  outline: 1px solid #fff;
}

.user-name {
  padding-top: 7px;
  margin-left: 13px;
  color: white;
  font-size: 18px;
}

.fans-mono {
  @apply text-white text-[16px];
  font-family: "Google Sans Text", Arial, Helvetica, sans-serif;
}

.fans-number {
  @apply tracking-[1px] leading-[38px] text-white text-[29px];
}

.fans-date {
  @apply tracking-[0.4px] leading-[21px] text-[16px] text-white;
}

.kenny-mini {
  font-family: "kenny mini";
}
</style>
