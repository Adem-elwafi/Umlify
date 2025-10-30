<template>
  <div
    class="uml-element"
    :class="['usecase', { selected }]"
    :style="{ left: x + 'px', top: y + 'px' }"
    @mousedown="startDrag"
    @click.stop="handleClick"
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

function handleClick() {
  if (!dragging.value) emit('click')
}

function startDrag(event) {
  // mark dragging so we don't trigger selection on mouseup click
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
</style>