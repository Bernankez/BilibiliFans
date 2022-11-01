<template>
  <div ref="fansCardEl" class="fans-card">
    <div class="absolute right-0 top-0 left-0 bottom-0">
      <slot></slot>
    </div>
    <div v-if="gradient" class="gradient"></div>
    <div class="relative h-full flex flex-col justify-between h-full">
      <div class="flex">
        <img class="avatar" :src="avatar" alt="avatar" />
        <span class="user-name">{{ nickname }}</span>
      </div>
      <div class="fans-no--wrapper">
        <div class="fans-mono">
          FANS NO.
        </div>
        <div class="fans-number kenny-mini">
          {{ fansNo }}
        </div>
      </div>
      <div class="fans-date--wrapper">
        <div class="fans-mono">
          DATE
        </div>
        <div class="fans-date">
          {{ date }}
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import dayjs from "dayjs";
import domToImage from "dom-to-image";
import { colorBackground } from "@/style/theme";

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
  baseFontSize = 16,
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
  baseFontSize?: number;
}>();

const computedFontSize = $computed(() => `${baseFontSize}px`);

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
  const style = getComputedStyle(fansCardEl);
  const width = Number(style.width.slice(0, -2));
  const height = Number(style.height.slice(0, -2));
  return domToImage.toBlob(fansCardEl, { width, height, style: { boxShadow: "unset", display: "block" } });
}

defineExpose({
  snapshot,
});
</script>

<style lang="scss" scoped>
.fans-card {
  position: relative;
  font-size: v-bind("computedFontSize");
  padding: calc(0.875 * v-bind("computedFontSize")) calc(1.125 * v-bind("computedFontSize"))
    calc(0.4375 * v-bind("computedFontSize")) calc(1.125 * v-bind("computedFontSize"));
  box-sizing: border-box;
  height: calc(12.5 * v-bind("computedFontSize"));
  width: calc(30.375 * v-bind("computedFontSize"));
  color: v-bind("textColor");
  border-radius: calc(0.375 * v-bind("computedFontSize"));
  background-color: v-bind("backgroundColor");
  box-shadow: 0 0 calc(0.625 * v-bind("computedFontSize")) 0 v-bind("colorBackground.darker");
  overflow: hidden;
  transition-property: all;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
  transition-duration: 250ms;

  .dark & {
    box-shadow: 0 0 calc(0.625 * v-bind("computedFontSize")) 0 #fff;
  }
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
  width: calc(1.9375 * v-bind("computedFontSize"));
  height: calc(1.9375 * v-bind("computedFontSize"));
  border-radius: calc(65 * v-bind("computedFontSize"));
  object-fit: cover;
  outline: calc(0.0625 * v-bind("computedFontSize")) solid #fff;
}

.user-name {
  font-size: calc(1.125 * v-bind("computedFontSize"));
  padding-top: calc(0.4375 * v-bind("computedFontSize"));
  margin-left: calc(0.8125 * v-bind("computedFontSize"));
}

.fans-no--wrapper {
  margin-top: calc(1 * v-bind("computedFontSize"));
}

.fans-mono {
  font-size: calc(1 * v-bind("computedFontSize"));
  opacity: 0.5;
  font-family: "Google Sans Text", Arial, Helvetica, sans-serif;
}

.fans-number {
  font-size: calc(1.8125 * v-bind("computedFontSize"));
  letter-spacing: calc(0.0625 * v-bind("computedFontSize"));
  line-height: calc(2.375 * v-bind("computedFontSize"));
}

.fans-date--wrapper {
  margin-top: calc(0.0625 * v-bind("computedFontSize"));
}

.fans-date {
  font-size: calc(1 * v-bind("computedFontSize"));
  letter-spacing: calc(0.025 * v-bind("computedFontSize"));
  line-height: calc(1.3125 * v-bind("computedFontSize"));
}

.kenny-mini {
  font-family: "kenny mini";
}
</style>
