import { ref, computed, type Ref } from 'vue'
import type { TranscriptWord } from '../types'

export function useRepeatRange(words: Ref<TranscriptWord[]>) {
  const startIndex = ref<number | null>(null)
  const endIndex = ref<number | null>(null)

  const isActive = computed(() => {
    return startIndex.value !== null && endIndex.value !== null
  })

  const startWord = computed(() => {
    return startIndex.value !== null ? words.value[startIndex.value] : null
  })

  const endWord = computed(() => {
    return endIndex.value !== null ? words.value[endIndex.value] : null
  })

  const wordCount = computed(() => {
    if (startIndex.value === null || endIndex.value === null) return 0
    return endIndex.value - startIndex.value + 1
  })

  function setStart(index: number) {
    startIndex.value = index

    if (endIndex.value !== null && index > endIndex.value) {
      ;[startIndex.value, endIndex.value] = [endIndex.value, startIndex.value]
    }
  }

  function setEnd(index: number) {
    endIndex.value = index

    if (startIndex.value !== null && index < startIndex.value) {
      ;[startIndex.value, endIndex.value] = [endIndex.value, startIndex.value]
    }
  }

  function clear() {
    startIndex.value = null
    endIndex.value = null
  }

  function isInRange(index: number): boolean {
    if (startIndex.value === null || endIndex.value === null) {
      return false
    }
    return index >= startIndex.value && index <= endIndex.value
  }

  return {
    startIndex,
    endIndex,
    isActive,
    startWord,
    endWord,
    wordCount,
    setStart,
    setEnd,
    clear,
    isInRange,
  }
}
