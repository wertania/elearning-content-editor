<template>
  <div class="pdf-container">
    <span>{{ name }}</span>
    <VPButton :href="url" text="Download" theme="alt" />

    <div v-if="isFirefox" class="pdf-container__firefox-help">
      <HelpIcon />

      <div class="firefox-tooltip">
        Firefox might download the PDF immediately instead of showing a preview.
        Refer to
        <a
          href="https://support.mozilla.org/gl/questions/985483"
          target="_blank"
          rel="noopener noreferrer"
        >
          this website
        </a>
        to prevent this.
      </div>
    </div>

    <div class="pdf-container__preview">
      <iframe
        title="Embedded PDF"
        ref="iframe"
        class="pdf-container__iframe"
        :src="url"
      />
    </div>
  </div>
</template>

<script lang="ts" setup>
import { VPButton } from "vitepress/theme";
import { onMounted } from "vue";
import { createPopper } from "@popperjs/core";
import HelpIcon from "./icons/help-icon.vue";

defineProps<{
  url: string;
  name: string;
}>();

const isFirefox = window.navigator.userAgent.includes("Firefox");

onMounted(() => {
  const target = document.querySelector(".firefox-help-icon");
  const tooltip = document.querySelector<HTMLElement>(".firefox-tooltip");
  if (!target || !tooltip) return;

  createPopper(target, tooltip, {
    placement: "bottom",
  });
});
</script>

<style lang="scss">
.pdf-container {
  margin: 1rem 0;
  display: flex;
  flex-wrap: wrap;
  background-color: var(--vp-c-default-soft);
  border-radius: 12px;
  align-items: center;
  justify-content: center;
  padding: 1rem;

  > * {
    margin: 0.5rem;
  }

  &__preview {
    width: 100%;
    height: auto;
    max-height: 80vh;
    aspect-ratio: 1 / 1.414;
  }

  &__iframe {
    border: none;
    width: 100%;
    height: 100%;
  }

  &__firefox-help {
    color: var(--vp-button-alt-text);

    .firefox-tooltip {
      position: absolute;
      visibility: hidden;

      padding: 0.5rem;
      border-radius: 12px;
      color: var(--vp-button-alt-text);
      background-color: var(--vp-button-alt-bg);
    }

    &:hover {
      .firefox-tooltip {
        visibility: visible;
      }
    }
  }
}
</style>
