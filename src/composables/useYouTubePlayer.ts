import { ref, shallowRef, onUnmounted } from 'vue'
import type { YT } from '../types'

let youtubeApiReady: Promise<void> | null = null

function loadYouTubeAPI(): Promise<void> {
  if (youtubeApiReady) {
    return youtubeApiReady
  }

  youtubeApiReady = new Promise<void>((resolve) => {
    if (window.YT && window.YT.Player) {
      resolve()
      return
    }

    window.onYouTubeIframeAPIReady = () => {
      resolve()
    }

    if (!document.querySelector('script[src*="youtube.com/iframe_api"]')) {
      const script = document.createElement('script')
      script.src = 'https://www.youtube.com/iframe_api'
      document.head.appendChild(script)
    }
  })

  return youtubeApiReady
}

export function useYouTubePlayer() {
  const player = shallowRef<YT.PlayerInstance | null>(null)
  const currentTime = ref(0)
  const duration = ref(0)
  const isPlaying = ref(false)
  const isReady = ref(false)

  let updateInterval: number | null = null

  async function initialize(elementId: string, videoId: string) {
    await loadYouTubeAPI()

    return new Promise<void>((resolve) => {
      player.value = new window.YT.Player(elementId, {
        videoId,
        playerVars: {
          playsinline: 1,
        },
        events: {
          onReady: (event) => {
            isReady.value = true
            duration.value = event.target.getDuration()
            startUpdateInterval()
            resolve()
          },
          onStateChange: (event) => {
            isPlaying.value = event.data === window.YT.PlayerState.PLAYING
          },
        },
      })
    })
  }

  function startUpdateInterval() {
    if (updateInterval !== null) return

    updateInterval = window.setInterval(() => {
      if (player.value && isPlaying.value) {
        currentTime.value = player.value.getCurrentTime()
      }
    }, 100)
  }

  function stopUpdateInterval() {
    if (updateInterval !== null) {
      clearInterval(updateInterval)
      updateInterval = null
    }
  }

  function seekTo(time: number) {
    if (player.value && isReady.value) {
      player.value.seekTo(time, true)
    }
  }

  function play() {
    if (player.value && isReady.value) {
      player.value.playVideo()
    }
  }

  function pause() {
    if (player.value && isReady.value) {
      player.value.pauseVideo()
    }
  }

  function getPlayerState(): number {
    if (player.value && isReady.value) {
      return player.value.getPlayerState()
    }
    return -1
  }

  onUnmounted(() => {
    stopUpdateInterval()
  })

  return {
    player,
    currentTime,
    duration,
    isPlaying,
    isReady,
    initialize,
    seekTo,
    play,
    pause,
    getPlayerState,
  }
}
