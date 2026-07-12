<template>
  <Section
    ref="sectionRef"
    id="productivity"
    spacing="xxl"
    custom-class="border-t border-border-default bg-bg-base/30 relative overflow-hidden"
  >
    <!-- 1px Animated Border Sweep (GPU accelerated) -->
    <svg class="absolute inset-0 w-full h-full pointer-events-none fill-none z-30" xmlns="http://www.w3.org/2000/svg">
      <rect
        x="0.5"
        y="0.5"
        width="calc(100% - 1px)"
        height="calc(100% - 1px)"
        rx="0"
        pathLength="100"
        class="stroke-transparent"
        :class="{ 'animate-border-sweep': isVisible }"
      />
    </svg>
    <Container size="xl">
      <Stack gap="xl" class="w-full">
        
        <!-- Section Header (Centered on mobile, left-aligned on desktop) -->
        <Stack gap="sm" align="center" class="lg:items-start text-center lg:text-left max-w-2xl">
          <Badge
            variant="accent"
            class="transition-all duration-500 ease-tactile transform"
            :class="isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'"
            style="transition-delay: 50ms;"
          >
            Built for Power Users
          </Badge>
          
          <h2
            class="text-3xl lg:text-4xl font-bold tracking-tight text-text-primary transition-all duration-500 ease-tactile transform"
            :class="isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'"
            style="transition-delay: 150ms;"
          >
            Every action is only a few keystrokes away.
          </h2>
          
          <p
            class="text-sm text-text-secondary leading-relaxed transition-all duration-500 ease-tactile transform"
            :class="isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'"
            style="transition-delay: 250ms;"
          >
            Umlify is designed around keyboard-driven workflows, allowing developers to create, connect, and export diagrams rapidly without constantly switching between mouse and keyboard.
          </p>
        </Stack>

        <!-- Two-column grid with responsive order mapping -->
        <Grid
          cols="12"
          cols-tablet="12"
          cols-mobile="1"
          gap="xl"
          class="items-center"
        >
          <!-- Left/Bottom Grid Column: Shortcut Cards -->
          <div
            class="col-span-12 lg:col-span-6 order-2 lg:order-1 transition-all duration-500 transform"
            :class="isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'"
            style="transition-delay: 350ms;"
          >
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-sm">
              <KeyboardShortcutCard
                v-for="s in shortcuts"
                :key="s.description"
                :keys="s.keys"
                :description="s.description"
              />
            </div>
          </div>

          <!-- Right/Top Grid Column: Animated Workspace Simulation -->
          <div
            class="col-span-12 lg:col-span-6 order-1 lg:order-2 flex justify-center transition-all duration-500 transform"
            :class="isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'"
            style="transition-delay: 450ms;"
          >
            <div class="w-full max-w-[450px]">
              <WorkspaceAutomation />
            </div>
          </div>
        </Grid>
        
      </Stack>
    </Container>
  </Section>
</template>

<script setup>
import { ref, onMounted } from 'vue'

import Section from './layout/Section.vue'
import Container from './layout/Container.vue'
import Grid from './layout/Grid.vue'
import Stack from './layout/Stack.vue'
import Badge from './Badge.vue'

import KeyboardShortcutCard from '../productivity/KeyboardShortcutCard.vue'
import WorkspaceAutomation from '../productivity/WorkspaceAutomation.vue'

const sectionRef = ref(null)
const isVisible = ref(false)

const shortcuts = [
  { keys: ['⌘/Ctrl', 'K'], description: 'Open Command Palette' },
  { keys: ['Tab'], description: 'Navigate Elements' },
  { keys: ['Ctrl', 'D'], description: 'Duplicate Selected Node' },
  { keys: ['Ctrl', '/'], description: 'Comment Selection' },
  { keys: ['Ctrl', 'Shift', 'E'], description: 'Export Diagram' },
  { keys: ['Space'], description: 'Temporary Pan Tool' }
]

onMounted(() => {
  if (!('IntersectionObserver' in window)) {
    isVisible.value = true
    return
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          isVisible.value = true
          observer.unobserve(entry.target)
        }
      })
    },
    {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    }
  )

  const el = sectionRef.value?.$el || sectionRef.value
  if (el) {
    observer.observe(el)
  }
})
</script>

<style scoped>
@media (prefers-reduced-motion: reduce) {
  .transform,
  .transition-all {
    transition: none !important;
    transform: none !important;
    animation: none !important;
    opacity: 1 !important;
  }
}
</style>
