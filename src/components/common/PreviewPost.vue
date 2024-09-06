<!-- eslint-disable no-template-curly-in-string -->
<script setup lang="tsx">
import type { VNode } from "vue";

const { postTemplate, name, no, link } = defineProps<{
  postTemplate?: string;
  name?: string;
  no?: number;
  link?: string;
}>();

// @unocss-include
const matches: [string, () => VNode | string | undefined][] = [
  ["#${name}#", () => (
    <span class="text-blue-700 dark:text-blue-300">
      #
      {name}
      #
    </span>
  )],
  ["${no}", () => no?.toString().padStart(6, "0")],
  ["${link}", () => (
    <a class="inline-flex items-baseline gap-1 text-blue-700 dark:text-blue-300" href={link} target="_blank">
      <div class="i-uil-link"></div>
      <span>网页链接</span>
    </a>
  )],
];

const post = computed<(() => (VNode | string)[]) | null>(() => {
  if (postTemplate) {
    const template: (VNode | string)[] = [];
    let _post = postTemplate;
    for (const [key, value] of matches) {
      const index = _post.indexOf(key);
      if (index !== -1) {
        template.push(_post.slice(0, index));
        template.push(value() ?? "");
        _post = _post.slice(index + key.length);
      }
    }
    template.push(_post);
    return () => template;
  }
  return null;
});
</script>

<template>
  <div class="break-all">
    <component :is="post" />
  </div>
</template>
