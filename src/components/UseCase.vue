<template>
  <div
    class="uml-element"
    :class="['usecase', { selected }]"
    :style="{ left: x + 'px', top: y + 'px' }"
  @mousedown="startDrag"
  @mouseup="handleMouseUp"
  >
    <!-- 4 Connection Points: top, bottom, left, right -->
    <div 
      class="ConectingPoint top" 
      @mousedown.stop
      @mouseup.stop="handleConnectionPointClick('top')"
    ></div>
    <div 
      class="ConectingPoint bottom" 
      @mousedown.stop
      @mouseup.stop="handleConnectionPointClick('bottom')"
    ></div>
    <div 
      class="ConectingPoint left" 
      @mousedown.stop
      @mouseup.stop="handleConnectionPointClick('left')"
    ></div>
    <div 
      class="ConectingPoint right" 
      @mousedown.stop
      @mouseup.stop="handleConnectionPointClick('right')"
    ></div>
    
    <input type="text" v-model="localLabel" @input="updateLabel">

  </div>
</template>

<script setup>
import { defineProps, defineEmits, ref, watch } from 'vue'
const props = defineProps({
  label: String,
  x: Number,
  y: Number,
  onDrag: Function,
  selected: { type: Boolean, default: false }
})
const emit = defineEmits(['click', 'update:label', 'connection-point-click'])

const localLabel = ref(props.label || 'Use Case')

// Watch for external prop changes
watch(() => props.label, (newLabel) => {
  localLabel.value = newLabel
})

function updateLabel() {
  emit('update:label', localLabel.value)
}

function handleConnectionPointClick(side) {
  emit('connection-point-click', side)
}

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
  // Don't start drag if clicking on input field
  if (event.target.tagName === 'INPUT') {
    return
  }
  
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
  padding: 16px 20px;
  background: var(--c-teal-transparent);
  border: 3px solid var(--c-teal);
  border-radius: 50%;
  cursor: grab;
  user-select: none;
  backdrop-filter: blur(8px);
  box-shadow: 
    0 8px 24px rgba(66, 122, 118, 0.3),
    inset 0 2px 8px rgba(255, 255, 255, 0.2);
  transition: all 0.2s ease;
  min-width: 120px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.usecase:hover {
  transform: translateY(-2px);
  box-shadow: 
    0 12px 32px rgba(66, 122, 118, 0.4),
    inset 0 2px 8px rgba(255, 255, 255, 0.25);
}

.usecase input {
  border: none;
  background: transparent;
  text-align: center;
  width: 100%;
  font-size: 14px;
  font-weight: 600;
  color: var(--c-dark-teal);
  outline: none;
  cursor: text;
  padding: 4px;
}

.usecase input:focus {
  background: rgba(245, 229, 225, 0.4);
  border-radius: 6px;
  box-shadow: 0 0 0 2px rgba(249, 180, 135, 0.5);
}

/* highlight selected elements */
.selected {
  border-color: var(--c-peach);
  background: var(--c-peach-transparent);
  box-shadow: 
    0 0 30px rgba(249, 180, 135, 0.6),
    0 12px 32px rgba(66, 122, 118, 0.4),
    inset 0 2px 10px rgba(255, 255, 255, 0.3);
  transform: translateZ(0) scale(1.05);
  transition: all 0.2s ease;
}
</style>