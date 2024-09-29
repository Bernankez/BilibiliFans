<script setup lang="ts">
import { accept, exportTemplate } from "@/utils/template";
import { draw } from "@/workers/draw";
import dayjs from "dayjs";
import type { DropdownMixedOption } from "naive-ui/es/dropdown/src/interface";

const { t } = useI18n();

const message = useMessage();

const templateStore = useTemplateStore();
const { currentTemplate } = storeToRefs(templateStore);
const userStore = useUserStore();
const { nickname, avatar, no } = storeToRefs(userStore);
const appStore = useAppStore();
const { imageSize } = storeToRefs(appStore);

function renderIcon(icon: string, as: "icon" | "emoji" = "icon") {
  if (as === "icon") {
    return () => {
      return h("div", {
        class: `${icon} text-xl`,
      });
    };
  }
  return () => icon;
}

// @unocss-include
const exportMenus = computed<DropdownMixedOption[]>(() => [
  {
    label: t("app.interface.save.saveImage.title"),
    key: "saveCard",
    icon: renderIcon("i-uil-image-download"),
  },
  {
    label: t("app.interface.save.export.title"),
    key: "export",
    icon: renderIcon("i-uil-file-export"),
  },
  {
    type: "divider",
  },
  {
    label: t("app.interface.save.saveTemplate.title"),
    key: "saveTemplate",
    icon: renderIcon("i-uil-postcard"),
  },
]);

const showNameDialog = ref(false);
const type = ref<"export" | "saveTemplate">();
const templateName = ref("");
watchEffect(() => {
  templateName.value = currentTemplate.value?.name || "";
});

function onNew() {
  currentTemplate.value = null;
}

const { copy } = useClipboard();
const { post } = usePost();

async function generateImage() {
  const imageBitMap = await draw({
    width: imageSize.value[0],
    height: imageSize.value[1],
    template: currentTemplate.value,
    user: {
      nickname: nickname.value,
      avatar: avatar.value,
      no: no.value,
      date: currentTemplate.value?.copywriting.date || dayjs().format("YYYY/MM/DD"),
    },
  });
  const canvas = document.createElement("canvas");
  canvas.width = imageSize.value[0];
  canvas.height = imageSize.value[1];
  const ctx = canvas.getContext("2d")!;
  ctx.drawImage(imageBitMap, 0, 0);
  const url = canvas.toDataURL();
  const a = document.createElement("a");
  a.href = url;
  a.download = `${templateName.value}-${no.value.toString().padStart(6, "0")}.png`;
  a.click();
  URL.revokeObjectURL(url);
  await copy(post.value);
  message.success(t("app.interface.save.saveImage.success"));
}

function onSelect(key: string) {
  switch (key) {
    case "saveCard":
      generateImage();
      break;
    case "export":
      type.value = "export";
      showNameDialog.value = true;
      break;
    case "saveTemplate":
      type.value = "saveTemplate";
      showNameDialog.value = true;
      break;
  }
}

async function onConfirm(name: string) {
  templateName.value = name;
  if (currentTemplate.value) {
    switch (type.value) {
      case "export": {
        const blob = await exportTemplate({
          ...currentTemplate.value,
          name,
        });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `${name}${accept}`;
        a.click();
        URL.revokeObjectURL(url);
        message.success(t("app.interface.save.export.success"));
        break;
      }
      case "saveTemplate": {
        await templateStore.addCustomTemplate({
          ...currentTemplate.value,
          name,
        });
        message.success(t("app.interface.save.saveTemplate.success"));
        break;
      }
    }
  }
}
</script>

<template>
  <header class="h-[var(--header-height)] flex items-center justify-between overflow-hidden b-b-1 b-border b-solid p-2">
    <div>
      <div class="flex items-center gap-2">
        <div class="i-fluent-emoji-sparkles text-4xl"></div>
        <span class="hidden text-xl font-bold font-mono md:inline">BilibiliFans</span>
      </div>
    </div>
    <div class="flex items-center gap-3">
      <template v-if="currentTemplate">
        <NPopconfirm :width="300" :positive-text="t('app.interface.new.confirm.confirm')" placement="bottom" @positive-click="onNew">
          <template #trigger>
            <ResponsiveButton secondary type="error" :tooltip="t('app.interface.new.title')">
              <template #icon>
                <div class="i-uil-times-square"></div>
              </template>
              {{ t("app.interface.new.title") }}
            </ResponsiveButton>
          </template>
          {{ t("app.interface.new.confirm.title") }}
        </NPopconfirm>
        <NDropdown trigger="click" placement="bottom" :options="exportMenus" @select="onSelect">
          <ResponsiveButton placement="bottom-end" type="primary" :tooltip="t('app.interface.save.title')">
            <template #icon>
              <div class="i-uil-save"></div>
            </template>
            {{ t("app.interface.save.title") }}
          </ResponsiveButton>
        </NDropdown>
      </template>
    </div>
    <NameDialog v-model="showNameDialog" :template="currentTemplate" @confirm="onConfirm" />
  </header>
</template>
