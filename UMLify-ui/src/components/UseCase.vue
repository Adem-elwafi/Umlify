<template>
  <div
    class="uml-element element relative w-full h-full cursor-grab active:cursor-grabbing transition-colors duration-200 select-none flex items-center justify-center bg-white text-zinc-900 border border-zinc-200/80 shadow-sm shadow-zinc-200/40 dark:bg-[#111827] dark:text-zinc-100 dark:border dark:border-zinc-800/80 dark:shadow-none rounded-full px-4 py-2"
    :class="[
      selected ? 'scale-[1.02]' : 'hover:border-zinc-400/80 dark:hover:border-zinc-700/80',
      { 'opacity-80': dragging }
    ]"
    :style="{}"
    @mousedown="startDrag"
    @mouseup="handleMouseUp"
  >
    <input 
      type="text" 
      v-model="localLabel" 
      @input="updateLabel"
      autocomplete="off"
      class="text-xs font-medium tracking-tight text-inherit text-center w-full bg-transparent border-none outline-none focus:ring-0"
    >

    <!-- Resize handles (only show when selected) -->
    <div 
      v-if="selected" 
      class="absolute -bottom-2.5 -right-2.5 w-6 h-6 flex items-center justify-center cursor-nwse-resize z-30 select-none"
      @mousedown.stop="startResize"
    >
      <div class="w-2.5 h-2.5 bg-white border border-accent-blue rounded-md shadow-sm hover:bg-accent-blue/10 transition-all active:scale-90"></div>
    </div>

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

const localLabel = ref(props.label || 'Use Case')

watch(() => props.label, (newLabel) => {
  localLabel.value = newLabel
})

function updateLabel() {
  emit('update:label', localLabel.value)
}

const dragging = ref(false)
const resizing = ref(false)
const moved = ref(false)

function handleMouseUp(event) {
  if (!moved.value) {
    emit('click', event)
  }
  moved.value = false
}

function startDrag(event) {
  if (event.target.tagName === 'INPUT') return
  
  dragging.value = true
  moved.value = false
  const startX = event.clientX
  const startY = event.clientY
  const initialX = props.x
  const initialY = props.y

  const move = (e) => {
    const dx = e.clientX - startX
    const dy = e.clientY - startY
    if (Math.abs(dx) > 3 || Math.abs(dy) > 3) moved.value = true
    if (props.onDrag) props.onDrag(initialX + dx, initialY + dy)
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
  if (event && typeof event.stopPropagation === 'function') {
    event.stopPropagation()
  }
  resizing.value = true
  const startX = event.clientX
  const startY = event.clientY
  const initialWidth = props.width || 140
  const initialHeight = props.height || 80

  const resize = (e) => {
    const dx = e.clientX - startX
    const dy = e.clientY - startY
    const newWidth = Math.max(100, initialWidth + dx)
    const newHeight = Math.max(50, initialHeight + dy)
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
