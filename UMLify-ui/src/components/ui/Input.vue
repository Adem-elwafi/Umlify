<template>
  <div class="flex flex-col gap-xxs w-full">
    <!-- Label -->
    <label
      v-if="label"
      class="font-sans text-xs font-medium text-text-secondary select-none"
    >
      {{ label }}
    </label>

    <!-- Input Wrapper -->
    <div class="relative w-full">
      <input
        :type="type"
        :value="modelValue"
        @input="$emit('update:modelValue', $event.target.value)"
        :placeholder="placeholder"
        :disabled="disabled"
        class="w-full h-10 px-md py-xs font-sans text-sm bg-transparent border rounded-interactive text-text-primary placeholder:text-text-muted transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-interactive-accent focus-visible:ring-offset-2 focus-visible:ring-offset-bg-base disabled:pointer-events-none disabled:opacity-dim"
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
    type: [String, Number],
    default: ''
  },
  label: {
    type: String,
    default: ''
  },
  type: {
    type: String,
    default: 'text'
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
  customClass: {
    type: String,
    default: ''
  }
})

defineEmits(['update:modelValue'])
</script>
