<template>
  <div
    class="uml-element element relative w-full h-full cursor-grab active:cursor-grabbing transition-colors duration-200 select-none flex items-center justify-center bg-white text-zinc-900 border border-zinc-200/80 shadow-sm shadow-zinc-200/40 dark:bg-[#111827] dark:text-zinc-100 dark:border dark:border-zinc-800/80 dark:shadow-none rounded-full px-4 py-2"
    :class="[
      selected ? 'scale-[1.02]' : 'hover:border-zinc-400/80 dark:hover:border-zinc-700/80'
    ]"
    :style="{}"
  >
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
      draggable="false"
      @dragstart.prevent
      :class="[
        'text-xs font-medium tracking-tight text-inherit text-center w-full outline-none resize-none whitespace-normal text-wrap break-words min-h-9 transition-all duration-200',
        isEditing 
          ? 'bg-bg-surface border border-border-default ring-2 ring-interactive-accent/35' 
          : 'bg-transparent border border-transparent cursor-pointer select-none'
      ]"
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

const localLabel = ref(props.label || 'Use Case')
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
