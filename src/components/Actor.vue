<template>
  <div
    class="actor"
    :class="{ selected }"
    :style="{ left: x + 'px', top: y + 'px' }"
    @mousedown="startDrag"
    @mouseup="handleMouseUp"
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
const moved = ref(false)

function handleClick() {
  // Only emit click if we didn't just finish a drag
  if (!dragging.value) {
    console.log('Actor clicked, id?', props)
    emit('click')
  }
}
function handleMouseUp() {
  // Only emit click if we didn't move the element (not a drag)
  if (!moved.value) {
    console.log('Actor clicked, props:', props)
    emit('click')
  }
  // reset moved for next interaction
  moved.value = false
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
    
      // mark that we've moved enough to be a drag
      if (Math.abs(dx) > 3 || Math.abs(dy) > 3) moved.value = true
    
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

/* highlight selected elements */
.selected {
  box-shadow: 0 0 10px rgba(0,123,255,0.65);
  transform: translateZ(0) scale(1.02);
  transition: box-shadow 0.12s ease, transform 0.12s ease;
}
</style>