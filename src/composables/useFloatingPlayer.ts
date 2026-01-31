import { ref, onMounted, onUnmounted, type Ref } from 'vue'

export function useFloatingPlayer(sentinelRef: Ref<HTMLElement | null>) {
  const isFloating = ref(false)
  const isPinned = ref(false)

  let isWide = false
  let isScrolledOut = false
  let manualOverride: 'float' | 'unfloat' | null = null
  let mediaQuery: MediaQueryList | null = null
  let observer: IntersectionObserver | null = null

  function update() {
    if (!isWide) {
      isFloating.value = false
      return
    }
    if (manualOverride === 'float') {
      isFloating.value = true
    } else if (manualOverride === 'unfloat') {
      isFloating.value = false
    } else {
      isFloating.value = isScrolledOut
    }
    isPinned.value = isWide && isScrolledOut && manualOverride === 'unfloat'
  }

  function toggleFloat() {
    manualOverride = isFloating.value ? 'unfloat' : 'float'
    update()
  }

  function handleMediaChange(e: MediaQueryListEvent | MediaQueryList) {
    isWide = e.matches
    update()
  }

  onMounted(() => {
    mediaQuery = window.matchMedia('(min-width: 1200px)')
    isWide = mediaQuery.matches
    mediaQuery.addEventListener('change', handleMediaChange)

    observer = new IntersectionObserver(
      ([entry]) => {
        isScrolledOut = !entry.isIntersecting
        manualOverride = null
        update()
      },
      { threshold: 0 }
    )

    if (sentinelRef.value) {
      observer.observe(sentinelRef.value)
    }
  })

  onUnmounted(() => {
    mediaQuery?.removeEventListener('change', handleMediaChange)
    observer?.disconnect()
  })

  return { isFloating, isPinned, toggleFloat }
}
