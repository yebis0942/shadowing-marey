<script setup vapor lang="ts">
import { onMounted } from 'vue'

defineProps<{
  videoId: string
}>()

const emit = defineEmits<{
  ready: []
}>()

onMounted(() => {
  emit('ready')
})
</script>

<template>
  <div id="player"></div>
</template>
