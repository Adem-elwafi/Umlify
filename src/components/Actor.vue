<template>
  <div
    class="actor element"
    :class="{ selected, dragging, resizing }"
    :style="{ 
      left: x + 'px', 
      top: y + 'px',
      width: width ? width + 'px' : 'auto',
      height: height ? height + 'px' : 'auto'
    }"
    @mousedown="startDrag"
    @mouseup="handleMouseUp"
  >
    <!-- Resize handles (only show when selected) -->
    <div v-if="selected" class="resize-handle bottom-right" @mousedown.stop="startResize"></div>
    
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
import { ref, watch } from 'vue'

const props = defineProps({
  label: String,
  x: Number,
  y: Number,
  width: Number,
  height: Number,
  onDrag: Function,
  onResize: Function,
  selected: { type: Boolean, default: false }
})
const emit = defineEmits(['click', 'update:label', 'connection-point-click'])

const localLabel = ref(props.label || 'Actor')

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
const resizing = ref(false)
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
  // Don't start drag if clicking on input field
  if (event.target.tagName === 'INPUT') {
    return
  }
  
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

function startResize(event) {
  event.stopPropagation()
  
  resizing.value = true
  
  const startX = event.clientX
  const startY = event.clientY
  const initialWidth = props.width || 98
  const initialHeight = props.height || 50

  const resize = (e) => {
    const dx = e.clientX - startX
    const dy = e.clientY - startY
    
    const newWidth = Math.max(60, initialWidth + dx)
    const newHeight = Math.max(40, initialHeight + dy)
    
    if (props.onResize) {
      props.onResize(newWidth, newHeight)
    }
  }

  const stopResize = () => {
    window.removeEventListener('mousemove', resize)
    window.removeEventListener('mouseup', stopResize)
    setTimeout(() => { resizing.value = false }, 0)
  }

  window.addEventListener('mousemove', resize)
  window.addEventListener('mouseup', stopResize)
}
</script>

<style scoped>
.actor {
  position: absolute;
  padding: 12px 16px;
  background: var(--c-beige-transparent);
  border: 3px solid var(--c-teal);
  border-radius: 12px;
  cursor: grab;
  user-select: none;
  backdrop-filter: blur(8px);
  box-shadow: 
    0 8px 24px rgba(66, 122, 118, 0.25),
    inset 0 1px 0 rgba(255, 255, 255, 0.4);
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.actor.dragging {
  transition: none;
  cursor: grabbing;
}

.actor.resizing {
  transition: none;
}

.actor:hover {
  transform: translateY(-2px);
  box-shadow: 
    0 12px 32px rgba(66, 122, 118, 0.35),
    inset 0 1px 0 rgba(255, 255, 255, 0.4);
}

.actor input {
  border: none;
  background: transparent;
  text-align: center;
  width: 100%;
  font-size: 15px;
  font-weight: 600;
  color: var(--c-dark-teal);
  outline: none;
  cursor: text;
  padding: 4px;
}

.actor input:focus {
  background: rgba(249, 180, 135, 0.2);
  border-radius: 6px;
  box-shadow: 0 0 0 2px rgba(249, 180, 135, 0.4);
}

/* highlight selected elements */
.selected {
  border-color: var(--c-peach);
  background: rgba(249, 180, 135, 0.25);
  box-shadow: 
    0 0 30px rgba(249, 180, 135, 0.6),
    0 12px 32px rgba(66, 122, 118, 0.35),
    inset 0 1px 0 rgba(255, 255, 255, 0.5);
  transform: translateZ(0) scale(1.05);
  transition: all 0.2s ease;
}

/* Resize handle */
.resize-handle {
  position: absolute;
  width: 12px;
  height: 12px;
  background: var(--c-peach);
  border: 2px solid white;
  border-radius: 50%;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
  cursor: nwse-resize;
  z-index: 10;
}

.resize-handle.bottom-right {
  bottom: -6px;
  right: -6px;
}

.resize-handle:hover {
  background: var(--c-teal);
  transform: scale(1.2);
}

</style>