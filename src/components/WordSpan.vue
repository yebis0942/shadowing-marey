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
