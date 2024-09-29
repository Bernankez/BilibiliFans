<script setup lang="ts">
import { accept, importTemplate } from "@/utils/template";
import { breakpointsTailwind } from "@vueuse/core";
import type { TemplateManifest } from "@/types/template";
import type { UploadSettledFileInfo } from "naive-ui";

const { t } = useI18n();
const message = useMessage();
const appStore = useAppStore();
const { split, splitRatio } = storeToRefs(appStore);
const templateStore = useTemplateStore();
const { currentTemplate, defaultTemplates, customTemplates } = storeToRefs(templateStore);
const userStore = useUserStore();
const { nickname, avatar, no } = storeToRefs(userStore);

const { md } = useBreakpoints(breakpointsTailwind);

const mode = ref<"preview" | "edit">("preview");

function onCropperChange(_origin: [number, number], _size: [number, number]) {
  if (currentTemplate.value?.cardStyle.background) {
    // Trigger effect
    currentTemplate.value.cardStyle.background = {
      ...currentTemplate.value.cardStyle.background,
      origin: [..._origin],
      size: [..._size],
    };
  }
}

function onTemplate(template: TemplateManifest<Blob | string>) {
  templateStore.loadTemplate(template.id);
}

function fileValidate(file: UploadSettledFileInfo) {
  const type = `.${file.name.split(".")[1]}`;
  if (type !== accept) {
    message.error(t("app.interface.dragFileToOpen.typeValidate"));
    return false;
  }
}

async function importFile(file: UploadSettledFileInfo) {
  if (file.file) {
    const manifest = await importTemplate(file.file);
    if (manifest) {
      currentTemplate.value = manifest;
    }
  }
}
</script>

<template>
  <div class="relative h-full w-full flex items-center justify-center overflow-hidden">
    <template v-if="currentTemplate">
      <div class="absolute right-2 top-2 z-1 flex items-center gap-2 rounded-full bg-background bg-opacity-50 p-1.5 shadow transition hover:bg-opacity-100">
        <template v-if="!split">
          <NTooltip v-if="mode !== 'preview'" placement="bottom">
            <template #trigger>
              <NButton secondary circle @click="mode = 'preview'">
                <template #icon>
                  <div class="i-material-symbols-id-card-outline-rounded"></div>
                </template>
              </NButton>
            </template>
            <span>{{ t("app.interface.togglePreview") }}</span>
          </NTooltip>
          <NTooltip v-if="mode !== 'edit'" placement="bottom">
            <template #trigger>
              <NButton secondary circle @click="mode = 'edit'">
                <template #icon>
                  <div class="i-material-symbols-crop-rounded"></div>
                </template>
              </NButton>
            </template>
            <span>{{ t("app.interface.toggleEdit") }}</span>
          </NTooltip>
          <NTooltip placement="bottom">
            <template #trigger>
              <NButton secondary circle @click="split = true">
                <template #icon>
                  <div :class="md ? 'i-material-symbols-view-column-2-outline' : 'i-material-symbols-view-agenda-outline'"></div>
                </template>
              </NButton>
            </template>
            <span>{{ t("app.interface.splitWindow") }}</span>
          </NTooltip>
        </template>
        <NTooltip v-else placement="bottom">
          <template #trigger>
            <NButton secondary circle @click="split = false">
              <template #icon>
                <div class="i-material-symbols-crop-7-5-outline"></div>
              </template>
            </NButton>
          </template>
          <span>{{ t("app.interface.mergeWindow") }}</span>
        </NTooltip>
      </div>
      <template v-if="!split">
        <Transition name="card">
          <div v-show="mode === 'preview'" class="max-w-200 w-full p-4">
            <FansCard :nickname :avatar :no :date="currentTemplate.copywriting.date" :color="currentTemplate?.cardStyle.color" :background="currentTemplate?.cardStyle.background" :foreground="currentTemplate?.cardStyle.foreground" />
          </div>
        </Transition>
        <Transition name="card">
          <!-- The initial loading without DOM will cause the Cropper stencil to be positioned incorrectly when switch with v-show. Using v-lazy-show can solve this.
            The issue only occur on Mac and cannot reproduce on Windows. -->
          <!-- eslint-disable-next-line vue/require-toggle-inside-transition -->
          <div v-lazy-show="mode === 'edit'" class="h-full max-w-200 w-full flex items-center p-4">
            <Cropper v-model:image-restriction="currentTemplate.cardStyle.background.imageRestriction" :origin="currentTemplate?.cardStyle.background?.origin" :size="currentTemplate?.cardStyle.background?.size" class="max-h-full w-full" :img="currentTemplate?.cardStyle.background.image" :min-width="64" :aspect-ratio="1 / 0.4115" @change="onCropperChange" />
          </div>
        </Transition>
      </template>
      <!-- Split View -->
      <NSplit v-else v-model:size="splitRatio" :max="0.7" :min="0.3" :direction="md ? 'horizontal' : 'vertical'">
        <template #1>
          <div class="h-full flex items-center justify-center">
            <div class="max-w-200 w-full p-4">
              <FansCard :nickname :avatar :no :date="currentTemplate.copywriting.date" :color="currentTemplate?.cardStyle.color" :background="currentTemplate?.cardStyle.background" :foreground="currentTemplate?.cardStyle.foreground" />
            </div>
          </div>
        </template>
        <template #2>
          <div class="h-full flex items-center justify-center">
            <div class="h-full max-w-200 w-full flex items-center p-4">
              <Cropper v-model:image-restriction="currentTemplate.cardStyle.background.imageRestriction" :origin="currentTemplate?.cardStyle.background?.origin" :size="currentTemplate?.cardStyle.background?.size" class="max-h-full w-full" :img="currentTemplate?.cardStyle.background.image" :min-width="64" :aspect-ratio="1 / 0.4115" @change="onCropperChange" />
            </div>
          </div>
        </template>
      </NSplit>
    </template>
    <div v-else class="h-full w-full flex flex-col items-center overflow-auto p-4 @container">
      <div class="w-90 px-3 @3xl:w-184 @6xl:w-278">
        <NUpload :accept directory-dnd :show-file-list="false" :default-upload="false" @before-upload="v => fileValidate(v.file)" @change="v => importFile(v.file)">
          <NUploadDragger>
            <div class="w-full flex flex-col items-center justify-center gap-5">
              <div class="i-uil-file-import text-4xl"></div>
              <NText>
                {{ t("app.interface.dragFileToOpen.placeholder") }}
              </NText>
            </div>
          </NUploadDragger>
        </NUpload>
        <NH2>
          {{ t("app.interface.chooseTemplate") }}
        </NH2>
      </div>
      <div v-if="defaultTemplates.length" class="grid grid-cols-1 w-fit justify-items-center gap-x-4 gap-y-1 @3xl:grid-cols-2 @6xl:grid-cols-3">
        <div class="col-span-1 mb-0 w-full px-3 text-muted-foreground @3xl:col-span-2 @6xl:col-span-3">
          {{ t("action.template.select.placeholder.default") }}
        </div>
        <WelcomeFansCard v-for="template in defaultTemplates" :key="template.id" :template @click="onTemplate" />
      </div>
      <div v-if="customTemplates.length" class="grid grid-cols-1 w-fit justify-items-center gap-x-4 gap-y-1 @3xl:grid-cols-2 @6xl:grid-cols-3">
        <div class="col-span-1 mb-0 w-full px-3 text-muted-foreground @3xl:col-span-2 @6xl:col-span-3">
          {{ t("action.template.select.placeholder.custom") }}
        </div>
        <WelcomeFansCard v-for="template in customTemplates" :key="template.id" :template @click="onTemplate" />
      </div>
    </div>
  </div>
</template>

<style scoped>
.card-enter-active,
.card-leave-active {
  transition: opacity 0.5s ease;
}
.card-enter-from,
.card-leave-to {
  opacity: 0;
}

.card-enter-active,
.card-leave-active {
  position: absolute;
}
</style>
