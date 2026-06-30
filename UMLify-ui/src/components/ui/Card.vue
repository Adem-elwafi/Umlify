<template>
  <Surface
    depth="1"
    radius="md"
    :hoverable="hoverable"
    :custom-class="customClass"
    class="overflow-hidden"
  >
    <!-- Card Header (Optional) -->
    <div
      v-if="$slots.header"
      class="px-md py-sm border-b border-border-default"
    >
      <slot name="header" />
    </div>

    <!-- Card Body -->
    <div class="p-md">
      <slot />
    </div>

    <!-- Card Footer (Optional) -->
    <div
      v-if="$slots.footer"
      class="px-md py-sm border-t border-border-default bg-bg-base/40"
    >
      <slot name="footer" />
    </div>
  </Surface>
</template>

<script setup>
import Surface from './layout/Surface.vue'

defineProps({
  hoverable: {
    type: Boolean,
    default: false
  },
  customClass: {
    type: String,
    default: ''
  }
})
</script>
