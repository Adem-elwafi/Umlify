<template>
  <div
    class="note element relative w-full h-full cursor-grab active:cursor-grabbing transition-colors duration-200 select-none"
  >
    <!-- Note Body with folded corner styling -->
    <div 
      class="w-full h-full bg-amber-50/90 text-amber-900 border border-amber-200/60 dark:bg-amber-950/20 dark:text-amber-200 dark:border dark:border-amber-900/40 relative transition-colors duration-200 shadow-xs rounded-sm p-3 flex flex-col justify-between"
      :class="selected ? 'border-amber-400/80 ring-1 ring-amber-400/20' : 'hover:border-amber-300'"
    >
      <!-- Folded top-right corner -->
      <div class="absolute top-0 right-0 w-3 h-3 bg-amber-100 dark:bg-amber-900/40 border-l border-b border-amber-200/60 dark:border-amber-900/40 rounded-bl-sm"></div>

      <textarea
        v-model="localLabel"
        @mousedown.stop
        autocomplete="off"
        class="w-full h-full bg-transparent border-none outline-none focus:ring-0 text-[11px] text-inherit leading-normal resize-none overflow-hidden text-center py-1"
        placeholder="Note Text"
      ></textarea>

      <!-- Resize handles (only show when selected) -->
      <div 
        v-if="selected" 
        class="absolute -bottom-2.5 -right-2.5 w-6 h-6 flex items-center justify-center cursor-nwse-resize z-30 select-none"
        @mousedown.stop="emit('resize-start', $event)"
      >
        <div class="w-2.5 h-2.5 bg-white border border-interactive-accent rounded-md shadow-sm hover:bg-interactive-accent/10 transition-all active:scale-90"></div>
      </div>
      
      <!-- Delete button (shows when selected) -->
      <button
        v-if="selected"
        class="w-5 h-5 flex items-center justify-center bg-bg-surface border border-border-default text-text-secondary hover:text-error hover:border-error/30 transition-all rounded-lg text-[9px] shadow-xs cursor-pointer active:scale-95 absolute -top-2 -right-2 z-30"
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
const emit = defineEmits(['click', 'update:label', 'delete', 'resize-start'])

const localLabel = ref(props.label || 'Note')
watch(
  () => props.label,
  (val) => {
    if (typeof val === 'string') localLabel.value = val
  }
)
watch(localLabel, (val) => emit('update:label', val))

</script>
