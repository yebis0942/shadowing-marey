<script setup vapor lang="ts">
import { computed } from 'vue'

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
    return `🔁 Repeat: "${props.startWord}" → "${props.endWord}" (${props.wordCount} words)`
  }
  return ''
})
</script>

<template>
  <div v-if="visible" class="repeat-indicator">
    <span>{{ displayText }}</span>
    <button class="clear-repeat-btn" title="リピートを解除" @click="emit('clear')">
      ✕
    </button>
  </div>
</template>
