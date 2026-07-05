<template>
  <div
    class="actor element relative w-full h-full cursor-grab active:cursor-grabbing transition-colors duration-200 select-none"
    :class="[
      { 'scale-[1.02]': selected }
    ]"
    :style="{}"
  >
    <!-- Stick-man SVG Container -->
    <div class="flex flex-col items-center w-full h-full p-2">
      <svg 
        viewBox="0 0 100 100" 
        preserveAspectRatio="xMidYMid meet"
        class="w-full flex-1 text-zinc-800 dark:text-zinc-200 drop-shadow-sm"
      >
        <!-- Head -->
        <circle cx="50" cy="20" r="15" class="fill-white dark:fill-[#111827] stroke-zinc-800 dark:stroke-zinc-200" stroke-width="3" />
        <!-- Body Spine -->
        <line x1="50" y1="35" x2="50" y2="70" class="stroke-zinc-800 dark:stroke-zinc-200" stroke-width="3" />
        <!-- Arms -->
        <line x1="20" y1="45" x2="80" y2="45" class="stroke-zinc-800 dark:stroke-zinc-200" stroke-width="3" />
        <!-- Left Leg -->
        <line x1="50" y1="70" x2="25" y2="95" class="stroke-zinc-800 dark:stroke-zinc-200" stroke-width="3" />
        <!-- Right Leg -->
        <line x1="50" y1="70" x2="75" y2="95" class="stroke-zinc-800 dark:stroke-zinc-200" stroke-width="3" />
      </svg>
      
      <textarea 
        v-model="localLabel" 
        @input="updateLabel"
        @mousedown.stop
        rows="2"
        autocomplete="off"
        class="text-zinc-700 dark:text-zinc-300 text-xs mt-2 font-medium px-2 py-1 rounded-lg bg-white/60 dark:bg-zinc-900/60 border border-zinc-200/50 dark:border-zinc-800/50 text-center w-full outline-none focus:ring-2 focus:ring-blue-500/40 focus:border-blue-500/60 resize-none overflow-hidden whitespace-normal text-wrap break-words h-9"
      ></textarea>
    </div>

    <!-- Resize handles (only show when selected) -->
    <div 
      v-if="selected" 
      class="absolute -bottom-2.5 -right-2.5 w-6 h-6 flex items-center justify-center cursor-nwse-resize z-30 select-none"
      @mousedown.stop="emit('resize-start', $event)"
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
const emit = defineEmits(['click', 'update:label', 'delete', 'resize-start'])

const localLabel = ref(props.label || 'Actor')

watch(() => props.label, (newLabel) => {
  localLabel.value = newLabel
})

function updateLabel() {
  emit('update:label', localLabel.value)
}

</script>
