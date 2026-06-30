<template>
  <div class="flex flex-col gap-xxs w-full">
    <!-- Label -->
    <label
      v-if="label"
      class="font-sans text-xs font-medium text-text-secondary select-none"
    >
      {{ label }}
    </label>

    <!-- Textarea Wrapper -->
    <div class="relative w-full">
      <textarea
        :value="modelValue"
        @input="$emit('update:modelValue', $event.target.value)"
        :placeholder="placeholder"
        :disabled="disabled"
        :rows="rows"
        class="w-full px-md py-sm font-sans text-sm bg-transparent border rounded-interactive text-text-primary placeholder:text-text-muted transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-interactive-accent focus-visible:ring-offset-2 focus-visible:ring-offset-bg-base disabled:pointer-events-none disabled:opacity-dim resize-y"
        :class="[
          error 
            ? 'border-error focus-visible:ring-error' 
            : 'border-border-default hover:border-border-elevated focus-visible:ring-interactive-accent',
          customClass
        ]"
      />
    </div>

    <!-- Error Message -->
    <span
      v-if="error"
      class="font-sans text-xs text-error mt-xxs"
    >
      {{ error }}
    </span>
  </div>
</template>

<script setup>
defineProps({
  modelValue: {
    type: String,
    default: ''
  },
  label: {
    type: String,
    default: ''
  },
  placeholder: {
    type: String,
    default: ''
  },
  disabled: {
    type: Boolean,
    default: false
  },
  error: {
    type: String,
    default: ''
  },
  rows: {
    type: Number,
    default: 4
  },
  customClass: {
    type: String,
    default: ''
  }
})

defineEmits(['update:modelValue'])
</script>
