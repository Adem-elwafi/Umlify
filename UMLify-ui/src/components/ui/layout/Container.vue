<template>
  <div
    class="mx-auto w-full px-md md:px-lg"
    :class="[
      narrow ? 'max-w-[800px]' : sizeClasses[size],
      customClass
    ]"
  >
    <slot />
  </div>
</template>

<script setup>
defineProps({
  size: {
    type: String,
    default: 'xl',
    validator: (value) => ['sm', 'md', 'lg', 'xl', '2xl', 'full'].includes(value)
  },
  narrow: {
    type: Boolean,
    default: false
  },
  customClass: {
    type: String,
    default: ''
  }
})

const sizeClasses = {
  sm: 'max-w-[640px]',
  md: 'max-w-[800px]',
  lg: 'max-w-[1024px]',
  xl: 'max-w-[1200px]',
  '2xl': 'max-w-[1440px]',
  full: 'max-w-full'
}
</script>
