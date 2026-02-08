<script setup vapor lang="ts">
import { computed } from 'vue'
import SvgIcon from './SvgIcon.vue'

const props = defineProps<{
  startWord: string | null
  endWord: string | null
  wordCount: number
  visible: boolean
}>()

const emit = defineEmits<{
  clear: []
}>()

const displayText = computed(() => {
  if (props.startWord && props.endWord) {
    return `Repeat: "${props.startWord}" → "${props.endWord}" (${props.wordCount} words)`
  }
  return ''
})
</script>

<template>
  <div v-if="visible" class="repeat-indicator">
    <SvgIcon name="repeat" size="14px" />
    <span>{{ displayText }}</span>
    <button class="clear-repeat-btn" title="Cancel repeat" @click="emit('clear')">
      <SvgIcon name="clear" size="12px" />
    </button>
  </div>
</template>
