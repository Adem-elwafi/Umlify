<template>
  <div
    class="uml-element element relative w-full h-full cursor-grab active:cursor-grabbing transition-all select-none flex items-center justify-center bg-white border rounded-full px-4 py-2"
    :class="[
      selected ? 'z-20 scale-[1.02]' : 'border-primary-slate/20 shadow-xs hover:border-primary-slate/40 z-10',
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
      class="text-xs font-medium tracking-tight text-zinc-800 text-center w-full bg-transparent border-none outline-none focus:ring-0"
    >

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

function handleMouseUp() {
  if (!moved.value) {
    emit('click')
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
  const initialWidth = props.width || 160
  const initialHeight = props.height || 60

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
