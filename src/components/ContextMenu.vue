<script setup vapor lang="ts">
import { ref, watch, nextTick } from 'vue'

const props = defineProps<{
  x: number
  y: number
  visible: boolean
  isRangeActive: boolean
  inRepeatRange: boolean
}>()

const emit = defineEmits<{
  setStart: []
  setEnd: []
  clearRange: []
  close: []
}>()

const menuRef = ref<HTMLDivElement | null>(null)

watch(() => props.visible, async (visible) => {
  if (visible) {
    await nextTick()
    adjustPosition()
  }
})

function adjustPosition() {
  if (!menuRef.value) return

  const rect = menuRef.value.getBoundingClientRect()
  const menu = menuRef.value

  if (rect.right > window.innerWidth) {
    menu.style.left = `${window.innerWidth - rect.width - 10}px`
  } else {
    menu.style.left = `${props.x}px`
  }

  if (rect.bottom > window.innerHeight) {
    menu.style.top = `${window.innerHeight - rect.height - 10}px`
  } else {
    menu.style.top = `${props.y}px`
  }
}

function handleAction(action: string) {
  switch (action) {
    case 'set-start':
      emit('setStart')
      break
    case 'set-end':
      emit('setEnd')
      break
    case 'clear-range':
      emit('clearRange')
      break
  }
  emit('close')
}
</script>

<template>
  <div
    v-if="visible"
    ref="menuRef"
    class="context-menu"
    :style="{ left: x + 'px', top: y + 'px' }"
    @click.stop
  >
    <div v-if="isRangeActive" class="context-menu-item" @click="handleAction('clear-range')">
      Clear range
    </div>
    <div class="context-menu-item" @click="handleAction('set-start')">
      Set repeat start
    </div>
    <div class="context-menu-item" @click="handleAction('set-end')">
      Set repeat end
    </div>
  </div>
</template>
