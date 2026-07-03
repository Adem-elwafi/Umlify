<template>
  <Surface
    depth="1"
    radius="md"
    border
    hoverable
    custom-class="p-md bg-gradient-to-b from-bg-surface to-bg-surface/30 border border-border-default/80 hover:border-interactive-accent/30 flex flex-col justify-center h-full"
  >
    <Stack direction="row" gap="md" align="center" justify="between" class="w-full">
      <!-- Shortcut Keys -->
      <div class="flex items-center gap-xxs shrink-0 select-none">
        <kbd
          v-for="key in keys"
          :key="key"
          class="px-xs py-xxs font-mono text-[10px] font-bold rounded bg-bg-surface border border-border-default shadow-xs text-text-primary"
        >
          {{ key }}
        </kbd>
      </div>

      <!-- Description -->
      <span class="text-xs font-semibold text-text-secondary text-right">
        {{ description }}
      </span>
    </Stack>
  </Surface>
</template>

<script setup>
import Surface from '../ui/layout/Surface.vue'
import Stack from '../ui/layout/Stack.vue'

defineProps({
  keys: {
    type: Array,
    required: true
  },
  description: {
    type: String,
    required: true
  }
})
</script>
