<script setup vapor lang="ts">
import { onMounted } from 'vue'

defineProps<{
  videoId: string
  isFloating?: boolean
}>()

const emit = defineEmits<{
  ready: []
}>()

onMounted(() => {
  emit('ready')
})
</script>

<template>
  <div class="player-wrapper" :class="{ 'player-floating': isFloating }">
    <div id="player"></div>
  </div>
</template>

<style scoped>
.player-wrapper :deep(#player) {
  width: 100%;
  aspect-ratio: 16 / 9;
  background-color: #000;
}

.player-wrapper.player-floating :deep(#player) {
  min-width: 200px;
  min-height: 200px;
}
</style>
