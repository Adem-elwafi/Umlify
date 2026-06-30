<template>
  <Surface
    depth="1"
    radius="lg"
    :custom-class="customClass"
    class="flex flex-col overflow-hidden"
    :class="isExpanded ? 'h-full' : 'h-auto max-h-12'"
  >
    <!-- Panel Header -->
    <div
      class="px-md h-12 flex items-center justify-between border-b border-border-default select-none shrink-0"
    >
      <div class="flex items-center gap-xs">
        <!-- Collapse Trigger -->
        <button
          v-if="collapsible"
          @click="toggleCollapse"
          class="p-xxs hover:bg-bg-elevated rounded text-text-secondary hover:text-text-primary transition-colors focus:outline-none"
        >
          <svg
            class="h-4 w-4 transition-transform duration-200"
            :class="isExpanded ? 'rotate-90' : ''"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            stroke-width="2"
          >
            <path stroke-linecap="round" stroke-linejoin="round" d="M9 5l7 7-7 7" />
          </svg>
        </button>

        <span class="font-sans text-xs font-semibold uppercase tracking-wider text-text-primary">
          {{ title }}
        </span>
      </div>

      <!-- Action slot (right-aligned) -->
      <div class="flex items-center gap-xs">
        <slot name="actions" />
      </div>
    </div>

    <!-- Panel Body -->
    <div
      v-show="isExpanded"
      class="flex-1 overflow-y-auto min-h-0"
    >
      <slot />
    </div>
  </Surface>
</template>

<script setup>
import { ref } from 'vue'
import Surface from './layout/Surface.vue'

const props = defineProps({
  title: {
    type: String,
    default: ''
  },
  collapsible: {
    type: Boolean,
    default: false
  },
  defaultExpanded: {
    type: Boolean,
    default: true
  },
  customClass: {
    type: String,
    default: ''
  }
})

const isExpanded = ref(props.defaultExpanded)

const toggleCollapse = () => {
  if (props.collapsible) {
    isExpanded.value = !isExpanded.value
  }
}
</script>
