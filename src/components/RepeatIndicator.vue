<script setup vapor lang="ts">
import { computed } from 'vue'
import SvgIcon from './SvgIcon.vue'

const props = defineProps<{
  startWord: string | null
  endWord: string | null
  wordCount: number
  visible: boolean
  isFloating?: boolean
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

const shouldShow = computed(() => props.visible && !props.isFloating)
</script>

<template>
  <div v-if="shouldShow" class="repeat-indicator">
    <SvgIcon name="repeat" size="14px" />
    <span>{{ displayText }}</span>
    <button class="clear-repeat-btn" title="Cancel repeat" @click="emit('clear')">
      <SvgIcon name="clear" size="12px" />
    </button>
  </div>
</template>

<style scoped>
.repeat-indicator {
  margin-top: 10px;
  font-size: 12px;
  color: rgba(255, 255, 255, 0.7);
  display: flex;
  align-items: center;
  gap: 8px;
}

.clear-repeat-btn {
  background-color: transparent;
  color: rgba(255, 255, 255, 0.7);
  border: 1px solid rgba(255, 255, 255, 0.3);
  border-radius: 2px;
  padding: 0;
  font-size: 12px;
  line-height: 1;
  font-weight: bold;
  cursor: pointer;
  transition: all 0.2s ease;
  width: 16px;
  height: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.clear-repeat-btn:hover {
  background-color: #e67e22;
  border-color: #e67e22;
  color: white;
}

.clear-repeat-btn:active {
  opacity: 0.8;
}
</style>
