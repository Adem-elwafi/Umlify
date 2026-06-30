<template>
  <Teleport to="body">
    <!-- Backdrop Wrapper -->
    <transition name="fade">
      <div
        v-if="isOpen"
        class="fixed inset-0 w-full h-full bg-bg-overlay/60 backdrop-blur-md flex items-center justify-center p-md z-40"
        @click.self="$emit('close')"
      >
        <!-- Dialog Container -->
        <transition name="scale">
          <Surface
            depth="3"
            radius="lg"
            class="w-full max-w-lg flex flex-col overflow-hidden max-h-[85vh] z-50"
            @click.stop
          >
            <!-- Header -->
            <div class="px-lg h-14 flex items-center justify-between border-b border-border-default shrink-0">
              <span class="font-sans text-sm font-semibold text-text-primary">
                {{ title }}
              </span>

              <!-- Close Button -->
              <button
                @click="$emit('close')"
                class="p-xs text-text-secondary hover:text-text-primary hover:bg-bg-elevated rounded transition-colors focus:outline-none focus:ring-2 focus:ring-interactive-accent"
              >
                <svg
                  class="h-4 w-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  stroke-width="2"
                >
                  <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <!-- Body -->
            <div class="p-lg overflow-y-auto min-h-0 text-sm text-text-secondary leading-relaxed">
              <slot />
            </div>

            <!-- Footer (Optional) -->
            <div
              v-if="$slots.footer"
              class="px-lg py-sm border-t border-border-default bg-bg-base/40 flex justify-end gap-sm shrink-0"
            >
              <slot name="footer" />
            </div>
          </Surface>
        </transition>
      </div>
    </transition>
  </Teleport>
</template>

<script setup>
import Surface from './layout/Surface.vue'

defineProps({
  isOpen: {
    type: Boolean,
    required: true
  },
  title: {
    type: String,
    default: ''
  }
})

defineEmits(['close'])
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s cubic-bezier(0.16, 1, 0.3, 1);
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.scale-enter-active {
  transition: transform 0.25s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.25s cubic-bezier(0.16, 1, 0.3, 1);
}
.scale-leave-active {
  transition: transform 0.15s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.15s cubic-bezier(0.16, 1, 0.3, 1);
}
.scale-enter-from,
.scale-leave-to {
  opacity: 0;
  transform: scale(0.95);
}
</style>
