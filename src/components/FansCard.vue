<template>
  <div ref="fansCardEl" class="fans-card">
    <div class="absolute right-0 top-0 left-0 bottom-0">
      <slot name="image"></slot>
    </div>
    <div v-if="gradient" class="gradient"></div>
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
  avatar: _avatar = null as string | Blob | null,
  nickname = "",
  fansNo = "000001",
  date = dayjs().format("YYYY/MM/DD"),
  backgroundColor = "#fff",
  gradient = true,
  gradientColor = "#333",
  gradientStart = "10%",
  gradientEnd = "40%",
  textColor = "#ffffff",
} = defineProps<{
  avatar?: string | Blob | null;
  nickname?: string;
  fansNo?: string;
  date?: string;
  backgroundColor?: string;
  gradient?: boolean;
  gradientColor?: string;
  gradientStart?: string;
  gradientEnd?: string;
  textColor?: string;
}>();

let prevAvatar = "";
const avatar = $computed(() => {
  prevAvatar && URL.revokeObjectURL(prevAvatar);
  if (_avatar instanceof Blob) {
    prevAvatar = URL.createObjectURL(_avatar);
    return prevAvatar;
  } else {
    return _avatar || "";
  }
});

const fansCardEl = $ref<HTMLElement>();
function snapshot() {
  return html2canvas(fansCardEl, { scale: 1, backgroundColor: null });
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
  color: v-bind("textColor");
  border-radius: 6px;
  background-color: v-bind("backgroundColor");
  box-shadow: 0 0 5px 2px #ccc;
  overflow: hidden;
}

.gradient {
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
  font-size: 18px;
}

.fans-mono {
  @apply text-[16px];
  opacity: 0.5;
  font-family: "Google Sans Text", Arial, Helvetica, sans-serif;
}

.fans-number {
  @apply tracking-[1px] leading-[38px] text-[29px];
}

.fans-date {
  @apply tracking-[0.4px] leading-[21px] text-[16px];
}

.kenny-mini {
  font-family: "kenny mini";
}
</style>
