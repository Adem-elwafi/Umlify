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
        ref="labelInput"
        v-model="localLabel" 
        @input="updateLabel"
        @mousedown.stop
        @dblclick="enableEditing"
        @blur="disableEditing"
        :readonly="!isEditing"
        rows="2"
        autocomplete="off"
        :class="[
          'text-zinc-700 dark:text-zinc-300 text-xs mt-2 font-medium px-2 py-1 rounded-lg text-center w-full outline-none resize-none overflow-hidden whitespace-normal text-wrap break-words h-9 transition-all duration-200',
          isEditing 
            ? 'bg-bg-surface border border-border-default ring-2 ring-interactive-accent/35' 
            : 'bg-transparent border border-transparent cursor-pointer'
        ]"
      ></textarea>
    </div>

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
const isEditing = ref(false)
const labelInput = ref(null)

function enableEditing() {
  isEditing.value = true
  setTimeout(() => {
    labelInput.value?.focus()
  }, 0)
}

function disableEditing() {
  isEditing.value = false
}

watch(() => props.label, (newLabel) => {
  localLabel.value = newLabel
})

function updateLabel() {
  emit('update:label', localLabel.value)
}

</script>
