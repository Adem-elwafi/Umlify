<template>
  <section
    class="w-full relative"
    :class="[
      spacingClasses[spacing],
      customClass
    ]"
  >
    <slot />
  </section>
</template>

<script setup>
defineProps({
  spacing: {
    type: String,
    default: 'xxl',
    validator: (value) => ['none', 'sm', 'md', 'lg', 'xl', 'xxl'].includes(value)
  },
  customClass: {
    type: String,
    default: ''
  }
})

const spacingClasses = {
  none: 'py-0',
  sm: 'py-md',
  md: 'py-xl',
  lg: 'py-xxl',
  xl: 'py-xxxl',
  xxl: 'py-xxxl lg:py-[128px]'
}
</script>
