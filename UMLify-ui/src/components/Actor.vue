<template>
  <div
    class="actor element absolute cursor-grab active:cursor-grabbing transition-all select-none"
    :class="[
      selected ? 'z-20' : 'border border-primary-slate/20 shadow-sm rounded-xl bg-white z-10',
      { 'scale-[1.02]': selected, 'opacity-80': dragging }
    ]"
    :style="{ 
      left: x + 'px', 
      top: y + 'px',
      width: width ? width + 'px' : 'auto',
      height: height ? height + 'px' : 'auto'
    }"
    @mousedown="startDrag"
    @mouseup="handleMouseUp"
  >
    <!-- Vector Asset Container -->
    <div class="flex flex-col items-center p-3">
      <div class="w-10 h-10 flex items-center justify-center bg-zinc-50 rounded-lg border border-primary-slate/10 mb-1">
        <svg viewBox="0 0 24 24" class="w-6 h-6 text-primary-slate" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
          <circle cx="12" cy="7" r="4" />
        </svg>
      </div>
      
      <input 
        type="text" 
        v-model="localLabel" 
        @input="updateLabel"
        class="text-[11px] font-medium text-zinc-800 tracking-tight text-center truncate w-full bg-transparent border-none outline-none focus:ring-0"
      >
    </div>

    <!-- Resize handles (only show when selected) -->
    <div v-if="selected" class="w-2.5 h-2.5 bg-white border border-accent-blue rounded-md shadow-sm cursor-nwse-resize hover:bg-accent-blue/10 transition-all select-none z-30 active:scale-90 absolute -bottom-1 -right-1" @mousedown.stop="startResize"></div>
    
    <!-- Delete button (shows when selected) -->
    <button
      v-if="selected"
      class="w-5 h-5 flex items-center justify-center bg-primary-slate hover:bg-primary-slate/90 text-white rounded-lg text-[9px] shadow-md border border-primary-slate/20 transition-all cursor-pointer active:scale-95 absolute -top-2 -right-2 z-30"
      @mousedown.stop
      @mouseup.stop
      @click.stop="emit('delete')"
      title="Delete"
    >
      ×
    </button>
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
const emit = defineEmits(['click', 'update:label', 'delete'])

const localLabel = ref(props.label || 'Actor')

watch(() => props.label, (newLabel) => {
  localLabel.value = newLabel
})

function updateLabel() {
  emit('update:label', localLabel.value)
}

const dragging = ref(false)
const resizing = ref(false)
const moved = ref(false)

function handleMouseUp() {
  if (!moved.value) {
    emit('click')
  }
  moved.value = false
}

function startDrag(event) {
  if (event.target.tagName === 'INPUT') return
  
  dragging.value = true
  const startX = event.clientX
  const startY = event.clientY
  const initialX = props.x
  const initialY = props.y

  const move = (e) => {
    const dx = e.clientX - startX
    const dy = e.clientY - startY
    if (Math.abs(dx) > 3 || Math.abs(dy) > 3) moved.value = true
    props.onDrag(initialX + dx, initialY + dy)
  }

  const stop = () => {
    window.removeEventListener('mousemove', move)
    window.removeEventListener('mouseup', stop)
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
  const initialWidth = props.width || 120
  const initialHeight = props.height || 100

  const resize = (e) => {
    const dx = e.clientX - startX
    const dy = e.clientY - startY
    const newWidth = Math.max(80, initialWidth + dx)
    const newHeight = Math.max(80, initialHeight + dy)
    if (props.onResize) props.onResize(newWidth, newHeight)
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
