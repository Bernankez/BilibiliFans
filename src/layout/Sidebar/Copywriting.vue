<!-- eslint-disable unused-imports/no-unused-vars -->
<script setup lang="ts">
import { useDisabled } from "./useDisabled";

const { t } = useI18n();
const message = useMessage();
const templateStore = useTemplateStore();
const { currentTemplate } = storeToRefs(templateStore);
const defaultLink = "https://www.bilibili.com/h5/mall/home?navhide=1";
const userStore = useUserStore();
const { no } = storeToRefs(userStore);

function resetLink() {
  if (currentTemplate.value) {
    currentTemplate.value.copywriting.link = defaultLink;
  }
}

// eslint-disable-next-line no-template-curly-in-string
const defaultPost = "我是#${name}#的NO.${no}号真爱粉，靓号在手，走路带风，解锁专属粉丝卡片，使用专属粉丝装扮，你也来生成你的专属秀起来吧！${link}";

function resetPost() {
  if (currentTemplate.value) {
    currentTemplate.value.copywriting.post = defaultPost;
  }
}

const { copy } = useClipboard();
const { post } = usePost();
async function copyPost() {
  await copy(post.value);
  message.success(t("action.copywriting.form.post.copy.success"));
}

const { disabled } = useDisabled();
</script>

<template>
  <div>
    <NH2>
      {{ t("action.copywriting.title") }}
    </NH2>
    <NForm :disabled label-width="auto">
      <ActionFormItem :label="t('action.copywriting.form.vtuberName.title')">
        <NInput :value="currentTemplate?.copywriting.name" @update:value="v => currentTemplate && (currentTemplate.copywriting.name = v)" />
      </ActionFormItem>
      <ActionFormItem>
        <template #label>
          <div class="w-full flex items-center justify-between">
            {{ t('action.copywriting.form.themeLink.title') }}
            <!-- <NButton :disabled quaternary size="small" type="primary" @click="resetLink">
              {{ t('action.copywriting.form.themeLink.reset') }}
            </NButton> -->
          </div>
        </template>
        <NInput :value="currentTemplate?.copywriting.link" type="textarea" @update:value="v => currentTemplate && (currentTemplate.copywriting.link = v)" />
      </ActionFormItem>
      <ActionFormItem>
        <template #label>
          <div class="w-full flex items-center justify-between">
            {{ t('action.copywriting.form.post.title') }}
            <!-- <NButton :disabled quaternary size="small" type="primary" @click="resetPost">
              {{ t('action.copywriting.form.post.reset') }}
            </NButton> -->
          </div>
        </template>
        <NInput :value="currentTemplate?.copywriting.post" type="textarea" @update:value="v => currentTemplate && (currentTemplate.copywriting.post = v)" />
      </ActionFormItem>
      <ActionFormItem v-if="post" :label="t('action.copywriting.form.preview.title')">
        <div class="rounded bg-accent p-2">
          <PreviewPost :post-template="currentTemplate?.copywriting.post" :name="currentTemplate?.copywriting.name" :no :link="currentTemplate?.copywriting.link" @click="copyPost" />
        </div>
      </ActionFormItem>
    </NForm>
  </div>
</template>
