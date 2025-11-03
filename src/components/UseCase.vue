<template>
  <div
    class="uml-element"
    :class="['usecase', { selected }]"
    :style="{ left: x + 'px', top: y + 'px' }"
  @mousedown="startDrag"
  @mouseup="handleMouseUp"
  >
    {{ label }}
  </div>
</template>

<script setup>
import { defineProps, defineEmits, ref } from 'vue'
const props = defineProps({
  label: String,
  x: Number,
  y: Number,
  onDrag: Function,
  selected: { type: Boolean, default: false }
})
const emit = defineEmits(['click'])
const dragging = ref(false)
const moved = ref(false)

function handleMouseUp() {
  if (!moved.value) {
    console.log('UseCase clicked, props:', props)
    emit('click')
  }
  moved.value = false
}

function startDrag(event) {
  // mark dragging so we don't trigger selection on mouseup click
  dragging.value = true
  moved.value = false
  // Remember initial positions
  const startX = event.clientX
  const startY = event.clientY
  const initialX = props.x
  const initialY = props.y

  const move = (e) => {
    // Calculate how far we've moved
    const dx = e.clientX - startX
    const dy = e.clientY - startY
    if (Math.abs(dx) > 3 || Math.abs(dy) > 3) moved.value = true
    
    // Update position based on initial position plus movement
    props.onDrag(initialX + dx, initialY + dy)
  }

  const stop = () => {
    window.removeEventListener('mousemove', move)
    window.removeEventListener('mouseup', stop)
    // small delay to avoid immediate click after drag
    setTimeout(() => { dragging.value = false }, 0)
  }

  window.addEventListener('mousemove', move)
  window.addEventListener('mouseup', stop)
}
</script>

<style scoped>
.usecase {
  position: absolute;
  padding: 8px 12px;
  background: #eaffea;
  border: 2px solid #28a745;
  border-radius: 50%;
  cursor: grab;
  user-select: none;
}

/* highlight selected elements */
.selected {
  box-shadow: 0 0 10px rgba(0,123,255,0.65);
  transform: translateZ(0) scale(1.02);
  transition: box-shadow 0.12s ease, transform 0.12s ease;
}
</style>