<template>
  <Dialog v-model="show" title="更新日志" @confirm="show = false">
    <NScrollbar class="text-default dark:text-darkdefault" style="max-height: 400px" trigger="none">
      <div class="font-bold">
        目前Safari和火狐浏览器下样式有问题，推荐使用Edge或Chrome浏览器
      </div>
      <div>
        默认背景图来源：<a
          class="text-default dark:text-darkdefault hover:text-primary"
          href="https://space.bilibili.com/5659864" target="_blank"
        >鹿野灸</a>
      </div>
      <LogCard title="v0.4.0">
        <LogCardItem title="Features">
          <div>更换了默认背景图、默认装扮链接等，鹿野灸装扮要开售啦</div>
          <div>可以添加右侧渐变了</div>
          <div>暂时去掉了自适应缩放（因为不好用）</div>
        </LogCardItem>
      </LogCard>
      <LogCard title="v0.3.5">
        <LogCardItem title="Bug Fixes">
          <div>修复黑暗模式下导航栏不透明问题</div>
        </LogCardItem>
      </LogCard>
      <LogCard title="v0.3.4">
        <LogCardItem title="Improvements">
          <div>优化pwa缓存</div>
        </LogCardItem>
      </LogCard>
      <LogCard title="v0.3.3">
        <LogCardItem title="Bug Fixes">
          <div>修复自适应缩放模式下，页面垂直方向遮挡问题</div>
        </LogCardItem>
      </LogCard>
      <LogCard title="v0.3.2">
        <LogCardItem title="Features">
          <div>菜单栏现在可以收起了</div>
        </LogCardItem>
      </LogCard>
      <LogCard title="v0.3.1">
        <LogCardItem title="Features">
          <div>添加自适应缩放模式（默认关闭）</div>
          <div>现在可以选择生成图片大小了</div>
        </LogCardItem>
      </LogCard>
      <LogCard title="v0.3.0">
        <LogCardItem title="Features">
          <div>添加pwa支持</div>
        </LogCardItem>
      </LogCard>
      <LogCard title="v0.2.3">
        <LogCardItem title="Improvements">
          <div>优化生成图片时的样式，现在生成图片不会再有一闪而过的大图</div>
        </LogCardItem>
      </LogCard>
      <LogCard title="v0.2.2">
        <LogCardItem title="Bug Fixes">
          <div>修复生成图片多出部分透明像素问题</div>
        </LogCardItem>
      </LogCard>
      <LogCard title="v0.2.1">
        <LogCardItem title="Bug Fixes">
          <div>修复生成图片分辨率低问题</div>
        </LogCardItem>
      </LogCard>
      <LogCard title="v0.2.0">
        <LogCardItem title="Features">
          <div>适配黑暗模式</div>
          <div>优化小尺寸窗口下的的样式</div>
          <div>优化部分设置项</div>
        </LogCardItem>
        <LogCardItem title="Bug Fixes">
          <div>修复当设置前景渐变色时，过渡部分颜色发黑问题</div>
        </LogCardItem>
      </LogCard>
      <LogCard title="v0.1.1">
        <LogCardItem title="Features">
          <div>添加更新日志</div>
          <div>优化界面样式</div>
        </LogCardItem>
      </LogCard>
      <LogCard title="v0.1.0">
        完成基本功能
      </LogCard>
    </NScrollbar>
  </Dialog>
</template>

<script setup lang="ts">
import { NScrollbar } from "naive-ui";
import LogCard from "./LogCard.vue";
import LogCardItem from "./LogCardItem.vue";
import Dialog from "@/components/ui/Dialog.vue";

const { modelValue = false } = defineProps<{
  modelValue?: boolean;
}>();

const emit = defineEmits<{
  (event: "update:modelValue", show: boolean): void;
}>();

const show = $computed({
  get() {
    return modelValue;
  },
  set(v: boolean) {
    emit("update:modelValue", v);
  },
});
</script>
