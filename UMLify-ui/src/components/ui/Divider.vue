<template>
  <div
    class="border-border-default shrink-0"
    :class="[
      vertical ? 'border-l h-full w-px mx-sm' : 'border-t w-full my-sm',
      customClass
    ]"
  />
</template>

<script setup>
defineProps({
  vertical: {
    type: Boolean,
    default: false
  },
  customClass: {
    type: String,
    default: ''
  }
})
</script>
