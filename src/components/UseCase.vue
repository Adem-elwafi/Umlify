<template>
  <div
    class="usecase"
    :style="{ left: x + 'px', top: y + 'px' }"
    @mousedown="startDrag"
  >
    {{ label }}
  </div>
</template>

<script setup>
const props = defineProps({
  label: String,
  x: Number,
  y: Number,
  onDrag: Function
})

function startDrag(event) {
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