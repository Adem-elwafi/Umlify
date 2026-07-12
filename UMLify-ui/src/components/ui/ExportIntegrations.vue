<template>
  <Section
    ref="sectionRef"
    id="export-integrations"
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
      <Stack gap="xl" align="center" class="w-full">
        
        <!-- Section Header -->
        <Stack gap="sm" align="center" class="max-w-2xl text-center">
          <Badge
            variant="accent"
            class="transition-all duration-500 ease-tactile transform"
            :class="isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'"
            style="transition-delay: 50ms;"
          >
            Developer Workflow
          </Badge>
          
          <h2
            class="text-3xl lg:text-4xl font-bold tracking-tight text-text-primary transition-all duration-500 ease-tactile transform"
            :class="isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'"
            style="transition-delay: 150ms;"
          >
            Export once. Use everywhere.
          </h2>
          
          <p
            class="text-sm text-text-secondary leading-relaxed max-w-xl transition-all duration-500 ease-tactile transform"
            :class="isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'"
            style="transition-delay: 250ms;"
          >
            Your diagrams belong to you. Umlify produces portable assets that integrate naturally into documentation, repositories, presentations, and architecture discussions.
          </p>
        </Stack>

        <!-- Main Workflow Visualization -->
        <div class="w-full flex justify-center">
          <ExportWorkflow />
        </div>

        <!-- Usage Examples (Badges / Chips) -->
        <Stack
          gap="md"
          align="center"
          class="w-full transition-all duration-500 transform"
          :class="isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'"
          style="transition-delay: 750ms;"
        >
          <span class="text-[10px] font-mono uppercase tracking-widest text-text-muted select-none">
            Commonly Integrated With
          </span>
          
          <div class="flex flex-wrap justify-center gap-xs max-w-2xl select-none">
            <Badge
              v-for="example in usageExamples"
              :key="example"
              variant="neutral"
              class="px-sm py-xs text-[11px] font-semibold rounded-full border border-border-default/60 bg-bg-surface/50 text-text-secondary"
            >
              {{ example }}
            </Badge>
          </div>
        </Stack>
        
      </Stack>
    </Container>
  </Section>
</template>

<script setup>
import { ref, onMounted } from 'vue'

import Section from './layout/Section.vue'
import Container from './layout/Container.vue'
import Stack from './layout/Stack.vue'
import Badge from './Badge.vue'
import ExportWorkflow from '../workflow/ExportWorkflow.vue'

const sectionRef = ref(null)
const isVisible = ref(false)

const usageExamples = [
  'GitHub Repositories',
  'Technical Documentation',
  'Architecture Reviews',
  'System Presentations',
  'Developer Wikis'
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
