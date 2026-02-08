<script setup vapor lang="ts">
import { computed } from 'vue'

const props = defineProps<{
  word: string
  index: number
  isActive: boolean
  isRepeatStart: boolean
  isRepeatEnd: boolean
  inRepeatRange: boolean
}>()

const emit = defineEmits<{
  click: [index: number]
  contextmenu: [event: MouseEvent, index: number]
}>()

const classes = computed(() => ({
  word: true,
  active: props.isActive,
  'repeat-start': props.isRepeatStart,
  'repeat-end': props.isRepeatEnd,
  'in-repeat-range': props.inRepeatRange,
}))

function handleClick() {
  emit('click', props.index)
}

function handleContextMenu(event: MouseEvent) {
  event.preventDefault()
  emit('contextmenu', event, props.index)
}
</script>

<template>
  <span :class="classes" @click="handleClick" @contextmenu="handleContextMenu">
    {{ word }}
  </span>
</template>

<style scoped>
.word {
  display: inline;
  cursor: pointer;
  padding: 3px 4px;
  transition: background-color 0.2s ease;
  border-radius: 3px;
}

.word:hover {
  background-color: #e8f4f8;
}

.word.active {
  background-color: #3498db;
  color: white;
  padding: 3px 4px;
}

/* Repeat Range Highlights */
.word.repeat-start {
  border-left: 3px solid #e67e22;
  margin-left: -3px;
}

.word.repeat-end {
  border-right: 3px solid #e67e22;
  margin-right: -3px;
}

.word.repeat-start.repeat-end {
  border-left: 3px solid #e67e22;
  border-right: 3px solid #e67e22;
  margin-left: -3px;
  margin-right: -3px;
}

.word.in-repeat-range {
  background-color: #fff3e0;
}

.word.in-repeat-range:hover {
  background-color: #ffe0b2;
}

.word.in-repeat-range.active {
  background-color: #ff9800;
  color: white;
}
</style>
