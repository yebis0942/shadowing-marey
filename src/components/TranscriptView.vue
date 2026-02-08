<script setup vapor lang="ts">
import { ref, watch, nextTick } from 'vue'
import type { TranscriptWord } from '../types'
import WordSpan from './WordSpan.vue'

const props = defineProps<{
  words: TranscriptWord[]
  activeIndex: number
  repeatStartIndex: number | null
  repeatEndIndex: number | null
}>()

const emit = defineEmits<{
  wordClick: [index: number]
  wordContextMenu: [event: MouseEvent, index: number]
}>()

const wordRefs = ref<HTMLElement[]>([])

watch(() => props.activeIndex, async (newIndex) => {
  if (newIndex >= 0) {
    await nextTick()
    const element = wordRefs.value[newIndex]
    if (element) {
      element.scrollIntoView({
        behavior: 'smooth',
        block: 'center',
        inline: 'nearest',
      })
    }
  }
})

function isInRepeatRange(index: number): boolean {
  if (props.repeatStartIndex === null || props.repeatEndIndex === null) {
    return false
  }
  return index >= props.repeatStartIndex && index <= props.repeatEndIndex
}

function setWordRef(el: any, index: number) {
  if (el) {
    wordRefs.value[index] = el.$el || el
  }
}
</script>

<template>
  <div class="transcript-section">
    <template v-for="(wordData, index) in words" :key="index">
      <WordSpan
        :ref="(el) => setWordRef(el, index)"
        :word="wordData.word"
        :index="index"
        :is-active="index === activeIndex"
        :is-repeat-start="index === repeatStartIndex"
        :is-repeat-end="index === repeatEndIndex"
        :in-repeat-range="isInRepeatRange(index)"
        @click="emit('wordClick', index)"
        @contextmenu="(event, idx) => emit('wordContextMenu', event, idx)"
      />
      {{ ' ' }}
    </template>
  </div>
</template>

<style scoped>
.transcript-section {
  padding: 30px;
  font-size: 18px;
  line-height: 2;
  border-radius: 0 0 10px 10px;
}
</style>
