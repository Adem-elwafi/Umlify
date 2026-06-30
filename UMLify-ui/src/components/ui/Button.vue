<template>
  <button
    :type="type"
    :disabled="disabled || loading"
    class="inline-flex items-center justify-center font-sans font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-interactive-accent focus-visible:ring-offset-2 focus-visible:ring-offset-bg-base disabled:pointer-events-none disabled:opacity-dim cursor-pointer"
    :class="[
      variantClasses[variant],
      sizeClasses[size],
      radiusClass,
      full ? 'w-full' : '',
      customClass
    ]"
  >
    <!-- Loading Spinner -->
    <svg
      v-if="loading"
      class="animate-spin -ml-1 mr-2 h-4 w-4 text-current"
      fill="none"
      viewBox="0 0 24 24"
    >
      <circle
        class="opacity-25"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        stroke-width="4"
      />
      <path
        class="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
      />
    </svg>

    <!-- Optional Left Icon slot -->
    <span v-if="$slots.left && !loading" class="mr-2 inline-flex items-center justify-center">
      <slot name="left" />
    </span>

    <!-- Default Slot Content -->
    <span class="leading-none">
      <slot />
    </span>

    <!-- Optional Right Icon slot -->
    <span v-if="$slots.right" class="ml-2 inline-flex items-center justify-center">
      <slot name="right" />
    </span>
  </button>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  variant: {
    type: String,
    default: 'secondary',
    validator: (value) => ['primary', 'secondary', 'ghost'].includes(value)
  },
  size: {
    type: String,
    default: 'md',
    validator: (value) => ['sm', 'md', 'lg'].includes(value)
  },
  disabled: {
    type: Boolean,
    default: false
  },
  loading: {
    type: Boolean,
    default: false
  },
  type: {
    type: String,
    default: 'button'
  },
  customClass: {
    type: String,
    default: ''
  },
  full: {
    type: Boolean,
    default: false
  }
})

// Visual class definitions using theme tokens
const variantClasses = {
  primary: 'bg-interactive-primary text-bg-base hover:bg-interactive-hover active:opacity-solid shadow-sm',
  secondary: 'bg-transparent border border-border-default text-text-primary hover:bg-bg-surface hover:border-border-elevated active:bg-bg-elevated',
  ghost: 'bg-transparent text-text-secondary hover:bg-bg-surface hover:text-text-primary active:bg-bg-elevated'
}

const sizeClasses = {
  sm: 'px-xs py-xxs text-xs gap-xs h-8',
  md: 'px-md py-xs text-sm gap-xs h-10',
  lg: 'px-lg py-sm text-base gap-sm h-12'
}

const radiusClass = 'rounded-interactive'
</script>
