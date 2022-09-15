<template>
  <Dialog v-model="show" title="更新日志" @confirm="show = false">
    <div>
      <LogCard title="v0.1.1">
        <LogCardItem title="Features">
          <div>添加更新日志</div>
          <div>优化界面样式</div>
        </LogCardItem>
      </LogCard>
    </div>
    <div>
      <LogCard title="v0.1.0"> 完成基本功能 </LogCard>
    </div>
  </Dialog>
</template>

<script setup lang="ts">
import Dialog from "@/components/ui/Dialog.vue";
import LogCard from "./LogCard.vue";
import LogCardItem from "./LogCardItem.vue";

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

<style lang="scss" scoped></style>
