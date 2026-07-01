<template>
  <Section
    ref="sectionRef"
    id="diagram-showcase"
    spacing="xxl"
    custom-class="border-t border-border-default bg-bg-base/40 relative overflow-hidden"
  >
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
            Complete UML Toolkit
          </Badge>
          
          <h2
            class="text-3xl lg:text-4xl font-bold tracking-tight text-text-primary transition-all duration-500 ease-tactile transform"
            :class="isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'"
            style="transition-delay: 150ms;"
          >
            Every major UML diagram in one workspace.
          </h2>
          
          <p
            class="text-sm text-text-secondary leading-relaxed max-w-xl transition-all duration-500 ease-tactile transform"
            :class="isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'"
            style="transition-delay: 250ms;"
          >
            Umlify supports multiple UML diagram types using one consistent, keyboard-driven editing experience. No complex configuration, just rapid design.
          </p>
        </Stack>

        <!-- Diagram Grid -->
        <Grid
          cols="3"
          cols-tablet="2"
          cols-mobile="1"
          gap="lg"
          class="w-full animate-cards"
        >
          <div
            v-for="(item, index) in diagrams"
            :key="item.title"
            class="fade-up-card transition-all duration-500 ease-tactile transform"
            :class="isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'"
            :style="{ transitionDelay: `${350 + (index * 100)}ms` }"
          >
            <Card
              hoverable
              custom-class="group h-full text-left transition-all duration-300 focus-visible:ring-2 focus-visible:ring-interactive-accent focus-visible:outline-none hover:border-interactive-accent/50 bg-gradient-to-b from-bg-surface to-bg-surface/30 flex flex-col justify-between"
              tabindex="0"
              :aria-label="`Diagram showcase: ${item.title}. ${item.description}`"
            >
              <Stack gap="md" align="start" class="w-full flex-1 justify-between">
                
                <!-- Card Header Text -->
                <Stack gap="xxs" class="w-full">
                  <h3 class="text-sm font-semibold text-text-primary transition-colors duration-300 group-hover:text-interactive-accent">
                    {{ item.title }}
                  </h3>
                  <p class="text-xs text-text-secondary leading-relaxed min-h-[32px]">
                    {{ item.description }}
                  </p>
                </Stack>

                <!-- Vector Preview Component -->
                <div
                  class="w-full aspect-[3/2] p-sm bg-bg-base/30 rounded-interactive border border-border-default/60 overflow-hidden flex items-center justify-center 
                         transition-all duration-300 group-hover:bg-bg-base/80 group-hover:border-interactive-accent/25 group-hover:scale-[1.01]"
                >
                  <component :is="item.preview" />
                </div>

              </Stack>
            </Card>
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
import Card from './Card.vue'
import Badge from './Badge.vue'

import ClassPreview from '../diagrams/ClassPreview.vue'
import SequencePreview from '../diagrams/SequencePreview.vue'
import UseCasePreview from '../diagrams/UseCasePreview.vue'
import ActivityPreview from '../diagrams/ActivityPreview.vue'
import ComponentPreview from '../diagrams/ComponentPreview.vue'
import StatePreview from '../diagrams/StatePreview.vue'

const sectionRef = ref(null)
const isVisible = ref(false)

const diagrams = [
  {
    title: 'Class Diagram',
    description: 'Model system structure by showing classes, attributes, methods, and relationships.',
    preview: ClassPreview
  },
  {
    title: 'Sequence Diagram',
    description: 'Visualize message exchange flows and lifelines of interacting components.',
    preview: SequencePreview
  },
  {
    title: 'Use Case Diagram',
    description: 'Define system scope, user actors, and primary usage workflows.',
    preview: UseCasePreview
  },
  {
    title: 'Activity Diagram',
    description: 'Graph sequential control flows, decision diamonds, and operational branches.',
    preview: ActivityPreview
  },
  {
    title: 'Component Diagram',
    description: 'Architect modular service structures, ports, and assembly interfaces.',
    preview: ComponentPreview
  },
  {
    title: 'State Diagram',
    description: 'Specify state transitions, system events, and reactive lifecycle paths.',
    preview: StatePreview
  }
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
  .fade-up-card,
  .transform,
  .transition-all {
    transition: none !important;
    transform: none !important;
    animation: none !important;
    opacity: 1 !important;
  }
}
</style>
