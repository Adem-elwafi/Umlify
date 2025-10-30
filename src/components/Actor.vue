<template>
  <div
    class="actor"
    :class="{ selected }"
    :style="{ left: x + 'px', top: y + 'px' }"
    @mousedown="startDrag"
    @click.stop="handleClick"
  >
    {{ label }}
  </div>
</template>

<script setup>
import { ref } from 'vue'

const props = defineProps({
  label: String,
  x: Number,
  y: Number,
  onDrag: Function,
  selected: { type: Boolean, default: false }
})
const emit = defineEmits(['click'])

const dragging = ref(false)

function handleClick() {
  // Only emit click if we didn't just finish a drag
  if (!dragging.value) emit('click')
}

function startDrag(event) {
  dragging.value = true
  
  // Remember initial positions
  const startX = event.clientX
  const startY = event.clientY
  const initialX = props.x
  const initialY = props.y

  const move = (e) => {
    // Calculate how far we've moved
    const dx = e.clientX - startX
    const dy = e.clientY - startY
    
    // Update position based on initial position plus movement
    props.onDrag(initialX + dx, initialY + dy)
  }

  const stop = () => {
    window.removeEventListener('mousemove', move)
    window.removeEventListener('mouseup', stop)
    // small timeout to avoid immediate click firing in some browsers
    setTimeout(() => { dragging.value = false }, 0)
  }

  window.addEventListener('mousemove', move)
  window.addEventListener('mouseup', stop)
}
</script>

<style scoped>
.actor {
  position: absolute;
  padding: 8px 12px;
  background: #e0f0ff;
  border: 2px solid #007bff;
  border-radius: 6px;
  cursor: grab;
  user-select: none;
}
</style>