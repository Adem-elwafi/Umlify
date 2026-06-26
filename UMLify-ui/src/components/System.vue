<template>
  <div
    class="System element relative w-full h-full cursor-grab active:cursor-grabbing transition-all duration-200 ease-in-out select-none"
    :style="{}"
    @mousedown="startDrag"
    @mouseup="handleMouseUp"
  >
    <!-- Main Boundary Box -->
    <div 
      class="w-full h-full border border-dashed rounded-2xl relative transition-all duration-200 bg-zinc-500/5 text-zinc-900 border-zinc-300/80 dark:bg-zinc-400/5 dark:text-zinc-100 dark:border dark:border-zinc-800/60"
      :class="selected ? 'border-zinc-450 dark:border-zinc-600 shadow-sm' : 'border-zinc-300/80 dark:border-zinc-800/60'"
    >
      <!-- Namespace Label Badge -->
      <div class="absolute -top-2.5 left-4 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 px-2 py-0.5 rounded-md text-[10px] font-semibold tracking-wide text-zinc-500 dark:text-zinc-400 select-none shadow-xs" @mousedown.stop>
        <input
          type="text"
          v-model="localLabel"
          class="bg-transparent border-none outline-none focus:ring-0 text-inherit font-semibold text-center w-full min-w-[60px]"
          placeholder="SYSTEM"
        />
      </div>

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
      >×</button>
    </div>
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

function handleMouseUp(event) {
  if (!moved.value) {
    emit('click', event)
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
  event.stopPropagation()
  resizing.value = true
  const startX = event.clientX
  const startY = event.clientY
  const initialWidth = props.width || 300
  const initialHeight = props.height || 400

  const resize = (e) => {
    const dx = e.clientX - startX
    const dy = e.clientY - startY
    const newWidth = Math.max(200, initialWidth + dx)
    const newHeight = Math.max(200, initialHeight + dy)
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
