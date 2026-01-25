// YouTube Player types
export interface YT {
  Player: new (
    elementId: string,
    config: YT.PlayerOptions
  ) => YT.PlayerInstance
  PlayerState: {
    UNSTARTED: number
    ENDED: number
    PLAYING: number
    PAUSED: number
    BUFFERING: number
    CUED: number
  }
}

export namespace YT {
  export interface PlayerOptions {
    videoId: string
    playerVars?: {
      playsinline?: number
      [key: string]: any
    }
    events?: {
      onReady?: (event: PlayerEvent) => void
      onStateChange?: (event: PlayerStateEvent) => void
    }
  }

  export interface PlayerInstance {
    playVideo(): void
    pauseVideo(): void
    seekTo(seconds: number, allowSeekAhead: boolean): void
    getCurrentTime(): number
    getDuration(): number
    getPlayerState(): number
  }

  export interface PlayerEvent {
    target: PlayerInstance
  }

  export interface PlayerStateEvent extends PlayerEvent {
    data: number
  }
}

// Transcript types
export interface TranscriptWord {
  word: string
  start: number
  end: number
}

export interface TranscriptData {
  words: TranscriptWord[]
}

// Global window type extension
declare global {
  interface Window {
    YT: YT
    onYouTubeIframeAPIReady?: () => void
  }
}
