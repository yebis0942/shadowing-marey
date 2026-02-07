<script setup vapor lang="ts">
import { ref, watch, computed, onMounted, onUnmounted } from 'vue'
import YouTubePlayer from './components/YouTubePlayer.vue'
import TranscriptView from './components/TranscriptView.vue'
import ContextMenu from './components/ContextMenu.vue'
import RepeatIndicator from './components/RepeatIndicator.vue'
import SvgIcon from './components/SvgIcon.vue'
import { useYouTubePlayer } from './composables/useYouTubePlayer'
import { useTranscript } from './composables/useTranscript'
import { useRepeatRange } from './composables/useRepeatRange'
import { useRepeatLoop } from './composables/useRepeatLoop'
import { useFloatingPlayer } from './composables/useFloatingPlayer'
import transcriptData from '../kiCxBpSvz0.json'

const VIDEO_ID = '-kiCxBpSvz0'

const aboutOpen = ref(false)
const playerSentinel = ref<HTMLElement | null>(null)
const playerSectionRef = ref<HTMLElement | null>(null)
const sentinelHeight = ref<string | undefined>(undefined)

const { isFloating, isPinned, toggleFloat } = useFloatingPlayer(playerSentinel)

watch(isFloating, (floating) => {
  if (floating && playerSectionRef.value) {
    sentinelHeight.value = playerSectionRef.value.offsetHeight + 'px'
  } else {
    sentinelHeight.value = undefined
  }
})

const {
  currentTime,
  duration,
  isPlaying,
  initialize: initializePlayer,
  seekTo,
  play,
  pause,
  getPlayerState,
} = useYouTubePlayer()

const {
  words,
  activeIndex,
  load: loadTranscript,
  findActiveWord,
} = useTranscript()

const {
  startIndex: repeatStartIndex,
  endIndex: repeatEndIndex,
  isActive: repeatIsActive,
  startWord: repeatStartWord,
  endWord: repeatEndWord,
  wordCount: repeatWordCount,
  setStart: setRepeatStart,
  setEnd: setRepeatEnd,
  clear: clearRepeatRange,
  isInRange,
} = useRepeatRange(words)

// Context menu state
const contextMenuVisible = ref(false)
const contextMenuX = ref(0)
const contextMenuY = ref(0)
const contextMenuTargetIndex = ref<number | null>(null)

const { cancelLoop } = useRepeatLoop({
  currentTime,
  isPlaying,
  startIndex: repeatStartIndex,
  endIndex: repeatEndIndex,
  words,
  seekTo,
  play,
  pause,
})

// Stats
const stats = computed(() => {
  const dur = duration.value
  const minutes = Math.floor(dur / 60)
  const seconds = Math.floor(dur % 60)
  const durationStr = dur > 0 ? `${minutes}:${seconds.toString().padStart(2, '0')}` : 'Loading...'
  return `Total words: ${words.value.length} | Duration: ${durationStr}`
})

// Initialize
onMounted(() => {
  loadTranscript(transcriptData)
})

async function handlePlayerReady() {
  await initializePlayer('player', VIDEO_ID)
}

// Update active word based on current time
watch(currentTime, (time) => {
  let newActiveIndex = findActiveWord(time)

  // リピートモード中は、activeIndexがrepeatEndIndexを超えないように制限
  if (repeatEndIndex.value !== null && newActiveIndex > repeatEndIndex.value) {
    newActiveIndex = repeatEndIndex.value
  }

  if (newActiveIndex !== activeIndex.value) {
    activeIndex.value = newActiveIndex
  }
})

// Word click handler
function handleWordClick(index: number) {
  // Clear repeat if clicking outside range
  if (repeatStartIndex.value !== null && repeatEndIndex.value !== null) {
    if (index < repeatStartIndex.value || index > repeatEndIndex.value) {
      clearRepeatRangeAndLoop()
    }
  }

  const word = words.value[index]
  seekTo(word.start)

  if (getPlayerState() !== window.YT?.PlayerState.PLAYING) {
    play()
  }
}

// Context menu handlers
function handleWordContextMenu(event: MouseEvent, index: number) {
  contextMenuX.value = event.clientX
  contextMenuY.value = event.clientY
  contextMenuTargetIndex.value = index
  contextMenuVisible.value = true
}

function hideContextMenu() {
  contextMenuVisible.value = false
}

function handleSetStart() {
  if (contextMenuTargetIndex.value !== null) {
    setRepeatStart(contextMenuTargetIndex.value)
  }
}

function handleSetEnd() {
  if (contextMenuTargetIndex.value !== null) {
    setRepeatEnd(contextMenuTargetIndex.value)
  }
}

function handleClearRange() {
  clearRepeatRangeAndLoop()
}

function clearRepeatRangeAndLoop() {
  cancelLoop()
  clearRepeatRange()
}

// Global click to close context menu
onMounted(() => {
  document.addEventListener('click', hideContextMenu)
})

onUnmounted(() => {
  document.removeEventListener('click', hideContextMenu)
})
</script>

<template>
  <div class="container" :class="{ 'has-floating-player': isFloating }">
    <div class="header">
      <button class="about-toggle" @click="aboutOpen = !aboutOpen">
        <SvgIcon name="info" size="14px" />
        <span>About</span>
      </button>
      <h1>Shadowing Marey</h1>
      <p>Russian shadowing practice with Dostoevsky</p>

      <div v-show="aboutOpen" class="about-section">
        <p>
          Practice Russian shadowing with an audiobook of Dostoevsky's
          short story "The Peasant Marey" (Мужик Марей, 1876).
        </p>
        <p class="about-credit">
          Audio: Лариса Емец (Larisa Emets)<br>
          From the "Достоевский вслух" project by Православный блог
        </p>
        <p class="about-disclaimer">
          Audio used with gratitude, not affiliation.
        </p>
        <p class="about-usage">
          <strong>How to use:</strong> Click → Jump to position / Right-click → Set repeat range
        </p>
        <p class="about-github">
          <a href="https://github.com/yebis0942/shadowing-marey" target="_blank">GitHub</a>
        </p>
      </div>
    </div>

    <div ref="playerSectionRef" class="player-section" :class="{ 'player-floating': isFloating, 'player-pinned': isPinned }">
      <button class="float-toggle" :title="isFloating ? 'Expand player' : 'Float player'" @click="toggleFloat">
        <SvgIcon :name="isFloating ? 'expand' : 'float'" size="14px" />
      </button>
      <YouTubePlayer :video-id="VIDEO_ID" @ready="handlePlayerReady" />
      <RepeatIndicator
        :start-word="repeatStartWord?.word ?? null"
        :end-word="repeatEndWord?.word ?? null"
        :word-count="repeatWordCount"
        :visible="repeatIsActive"
        @clear="handleClearRange"
      />
    </div>
    <div ref="playerSentinel" class="player-sentinel" :style="{ height: sentinelHeight }"></div>

    <div class="stats">{{ stats }}</div>

    <TranscriptView
      :words="words"
      :active-index="activeIndex"
      :repeat-start-index="repeatStartIndex"
      :repeat-end-index="repeatEndIndex"
      @word-click="handleWordClick"
      @word-context-menu="handleWordContextMenu"
    />

    <ContextMenu
      :x="contextMenuX"
      :y="contextMenuY"
      :visible="contextMenuVisible"
      :is-range-active="repeatIsActive"
      :in-repeat-range="contextMenuTargetIndex !== null && isInRange(contextMenuTargetIndex)"
      @set-start="handleSetStart"
      @set-end="handleSetEnd"
      @clear-range="handleClearRange"
      @close="hideContextMenu"
    />
  </div>
</template>
