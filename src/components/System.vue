<template>
  <div
    class="System element"
    :class="{ selected, dragging, resizing }"
    :style="{ 
      left: x + 'px', 
      top: y + 'px',
      width: width ? width + 'px' : '380px',
      height: height ? height + 'px' : '560px'
    }"
    @mousedown="startDrag"
    @mouseup="handleMouseUp"
  >
    <!-- Resize handles (only show when selected) -->
    <div v-if="selected" class="resize-handle bottom-right" @mousedown.stop="startResize"></div>
    
    <!-- Delete button (shows when selected) -->
    <button v-if="selected" class="delete-btn" @click.stop="emit('delete')" title="Delete">×</button>
    
    <!-- Title bar -->
    <div class="system-header" @mousedown.stop>
      <input
        type="text"
        v-model="localLabel"
        class="system-title"
        placeholder="System name"
      />
    </div>

    <!-- Body (empty boundary box for grouping use cases visually) -->
    <div class="system-body"></div>
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
const emit = defineEmits(['click', 'update:label', 'connection-point-click', 'delete'])

// Local editable label synced with parent
const localLabel = ref(props.label || 'System')
watch(
  () => props.label,
  (val) => {
    if (typeof val === 'string') localLabel.value = val
  }
)
watch(localLabel, (val) => emit('update:label', val))






const dragging = ref(false)
const resizing = ref(false)
const moved = ref(false)

function handleClick() {
  // Only emit click if we didn't just finish a drag
  if (!dragging.value) {
    console.log('system clicked, id?', props)
    emit('click')
  }
}
function handleMouseUp() {
  // Only emit click if we didn't move the element (not a drag)
  if (!moved.value) {
    console.log('System clicked, props:', props)
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
  const initialWidth = props.width || 380
  const initialHeight = props.height || 560

  const resize = (e) => {
    const dx = e.clientX - startX
    const dy = e.clientY - startY
    
    const newWidth = Math.max(200, initialWidth + dx)
    const newHeight = Math.max(200, initialHeight + dy)
    
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
.System {
  position: absolute;
  padding: 16px;
  background: rgba(245, 229, 225, 0.6);
  border: 3px solid var(--c-teal);
  border-radius: 16px;
  cursor: grab;
  user-select: none;
  backdrop-filter: blur(8px);
  box-shadow: 
    0 8px 24px rgba(66, 122, 118, 0.25),
    inset 0 1px 0 rgba(255, 255, 255, 0.4);
  transition: transform 0.2s ease, box-shadow 0.2s ease;
  /* Keep system behind other draggable elements */
  z-index: -1;
}

.System.dragging {
  transition: none !important;
  cursor: grabbing;
}

.System.resizing {
  transition: none !important;
}


/* Header/title styles */
.system-header {
  position: absolute;
  top: 10px;
  left: 0;
  right: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  pointer-events: auto;
}

.system-title {
  border: 2px solid var(--c-teal);
  background: rgba(255, 255, 255, 0.85);
  border-radius: 10px;
  padding: 6px 10px;
  width: 220px;
  font-size: 16px;
  font-weight: 700;
  color: var(--c-teal);
  outline: none;
  cursor: text;
  text-align: left;
}

.system-title:focus {
  background: rgba(249, 180, 135, 0.15);
  box-shadow: 0 0 0 2px rgba(249, 180, 135, 0.35);
}

/* Body area just fills the remaining box (visual grouping) */
.system-body {
  position: absolute;
  inset: 0;
  border-radius: 12px;
  /* Subtle inner pattern/border to suggest a container */
  box-shadow: inset 0 0 0 2px rgba(66, 122, 118, 0.15);
}

/* highlight selected elements */
.selected {
  border-color: var(--c-peach);
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

/* Delete button */
.delete-btn {
  position: absolute;
  top: -10px;
  right: -10px;
  width: 24px;
  height: 24px;
  border-radius: 50%;
  border: 2px solid white;
  background: var(--c-peach);
  color: white;
  font-weight: 700;
  line-height: 18px;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4px 10px rgba(0,0,0,0.15);
  cursor: pointer;
  z-index: 20; /* above header */
}

.delete-btn:hover {
  background: var(--c-teal);
}

</style>