<script setup vapor lang="ts">
import { computed } from 'vue';

import clearIcon from '../assets/icons/clear.svg?raw';
import expandIcon from '../assets/icons/expand.svg?raw';
import floatIcon from '../assets/icons/float.svg?raw';
import infoIcon from '../assets/icons/info.svg?raw';
import repeatIcon from '../assets/icons/repeat.svg?raw';

const icons: Record<string, string> = {
  clear: clearIcon,
  expand: expandIcon,
  float: floatIcon,
  info: infoIcon,
  repeat: repeatIcon,
};

const props = defineProps<{
  name: string;
  size?: string;
}>();

const iconSvg = computed(() => icons[props.name] || null);

const svgStyle = computed(() => ({
  width: props.size || '1em',
  height: props.size || '1em',
}));
</script>

<template>
  <span v-if="iconSvg" v-html="iconSvg" :style="svgStyle" class="svg-icon"></span>
  <span v-else class="svg-icon error" :title="`Unknown icon: ${name}`">
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="red">
      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10s10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"/>
    </svg>
  </span>
</template>

<style scoped>
.svg-icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  vertical-align: middle;
}
.svg-icon :deep(svg) {
  width: 100%;
  height: 100%;
  fill: currentColor;
}
</style>
