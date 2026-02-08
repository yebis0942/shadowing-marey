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

<style scoped>
.context-menu {
  position: fixed;
  background-color: white;
  border: 1px solid #ccc;
  border-radius: 4px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
  z-index: 1000;
  min-width: 200px;
}

.context-menu-item {
  padding: 10px 15px;
  cursor: pointer;
  transition: background-color 0.2s ease;
}

.context-menu-item:hover {
  background-color: #f0f0f0;
}

.context-menu-item:first-child {
  border-radius: 4px 4px 0 0;
}

.context-menu-item:last-child {
  border-radius: 0 0 4px 4px;
}
</style>
