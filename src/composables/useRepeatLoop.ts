import { watch, onUnmounted, type Ref } from 'vue'
import type { TranscriptWord } from '../types'

type RepeatLoopOptions = {
  currentTime: Ref<number>
  isPlaying: Ref<boolean>
  startIndex: Ref<number | null>
  endIndex: Ref<number | null>
  words: Ref<TranscriptWord[]>
  seekTo: (time: number) => void
  play: () => void
  pause: () => void
  loopDelayMs?: number
}

export function useRepeatLoop(options: RepeatLoopOptions) {
  const loopDelayMs = options.loopDelayMs ?? 1000
  let repeatLoopTimeout: number | null = null
  let suppressRangeSeekUntil = 0

  function clearLoopTimeout() {
    if (repeatLoopTimeout !== null) {
      clearTimeout(repeatLoopTimeout)
      repeatLoopTimeout = null
    }
  }

  watch(options.currentTime, (time) => {
    const startIndex = options.startIndex.value
    const endIndex = options.endIndex.value
    if (startIndex === null || endIndex === null) {
      return
    }

    const endWord = options.words.value[endIndex]
    if (!endWord) {
      return
    }

    if (time >= endWord.end && repeatLoopTimeout === null) {
      options.pause()

      repeatLoopTimeout = window.setTimeout(() => {
        const updatedStartIndex = options.startIndex.value
        const startWord =
          updatedStartIndex === null ? undefined : options.words.value[updatedStartIndex]

        if (startWord) {
          options.seekTo(startWord.start)
          options.currentTime.value = startWord.start
          options.play()
          suppressRangeSeekUntil = performance.now() + 300
        }
        repeatLoopTimeout = null
      }, loopDelayMs)
    }
  })

  watch(options.isPlaying, (playing) => {
    if (!playing) {
      return
    }

    const startIndex = options.startIndex.value
    const endIndex = options.endIndex.value
    if (startIndex === null || endIndex === null) {
      return
    }

    const startWord = options.words.value[startIndex]
    const endWord = options.words.value[endIndex]
    if (!startWord || !endWord) {
      return
    }

    if (performance.now() < suppressRangeSeekUntil) {
      return
    }

    const time = options.currentTime.value
    if (time < startWord.start || time > endWord.end) {
      options.seekTo(startWord.start)
      options.currentTime.value = startWord.start
    }
  })

  function cancelLoop() {
    clearLoopTimeout()
  }

  onUnmounted(() => {
    clearLoopTimeout()
  })

  return {
    cancelLoop,
  }
}
