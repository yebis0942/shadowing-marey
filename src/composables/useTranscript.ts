import { ref } from 'vue'
import type { TranscriptWord, TranscriptData } from '../types'

export function useTranscript() {
  const words = ref<TranscriptWord[]>([])
  const activeIndex = ref(-1)

  function load(data: TranscriptData) {
    words.value = data.words
  }

  function findActiveWord(currentTime: number): number {
    return words.value.findIndex((word, index) => {
      const nextWord = words.value[index + 1]
      const endTime = nextWord ? nextWord.start : word.end
      return currentTime >= word.start && currentTime < endTime
    })
  }

  return {
    words,
    activeIndex,
    load,
    findActiveWord,
  }
}
