<template>
  <span
    class="inline-flex items-center gap-xxs px-xs py-xxs font-sans text-xs font-medium select-none rounded-full"
    :class="[
      variantClasses[variant],
      customClass
    ]"
  >
    <!-- Optional Left Slot (e.g., indicator dot or micro-icon) -->
    <slot name="left" />
    
    <slot />
  </span>
</template>

<script setup>
defineProps({
  variant: {
    type: String,
    default: 'neutral',
    validator: (value) => ['neutral', 'success', 'warning', 'error', 'accent'].includes(value)
  },
  customClass: {
    type: String,
    default: ''
  }
})

const variantClasses = {
  neutral: 'bg-bg-surface text-text-secondary border border-border-default',
  success: 'bg-success/10 text-success border border-success/20',
  warning: 'bg-warning/10 text-warning border border-warning/20',
  error: 'bg-error/10 text-error border border-error/20',
  accent: 'bg-interactive-accent/10 text-interactive-accent border border-interactive-accent/20'
}
</script>
