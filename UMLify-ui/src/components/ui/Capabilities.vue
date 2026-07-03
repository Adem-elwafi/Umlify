<template>
  <Section
    ref="sectionRef"
    id="capabilities"
    spacing="xxl"
    custom-class="border-t border-border-default bg-bg-base/30 relative overflow-hidden"
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
            Built for Modern Software Architecture
          </Badge>
          
          <h2
            class="text-3xl lg:text-4xl font-bold tracking-tight text-text-primary transition-all duration-500 ease-tactile transform"
            :class="isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'"
            style="transition-delay: 150ms;"
          >
            Everything you need to design software systems.
          </h2>
          
          <p
            class="text-sm text-text-secondary leading-relaxed max-w-xl transition-all duration-500 ease-tactile transform"
            :class="isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'"
            style="transition-delay: 250ms;"
          >
            Umlify combines a professional editor, automatic layout, fast keyboard-first editing workflows, and export capabilities inside one workspace.
          </p>
        </Stack>

        <!-- Capabilities Grid -->
        <Grid
          cols="3"
          cols-tablet="2"
          cols-mobile="1"
          gap="lg"
          class="w-full"
        >
          <div
            v-for="(cap, index) in capabilities"
            :key="cap.title"
            class="fade-up-card transition-all duration-500 ease-tactile transform"
            :class="isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'"
            :style="{ transitionDelay: `${350 + (index * 100)}ms` }"
          >
            <Card
              hoverable
              custom-class="group h-full text-left transition-all duration-300 focus-visible:ring-2 focus-visible:ring-interactive-accent focus-visible:outline-none hover:border-interactive-accent/30 bg-gradient-to-b from-bg-surface to-bg-surface/30"
              tabindex="0"
              :aria-label="`Capability: ${cap.title}. ${cap.description}`"
            >
              <Stack gap="md" align="start" class="h-full">
                <!-- Icon Container -->
                <div
                  class="p-xs rounded-interactive bg-bg-surface border border-border-default text-text-secondary transition-all duration-300 
                         group-hover:bg-bg-elevated/60 group-hover:border-interactive-accent/30 group-hover:text-interactive-accent group-hover:-translate-y-0.5"
                >
                  <component
                    :is="cap.icon"
                    class="w-5 h-5 transition-all duration-300"
                    :class="cap.iconClass"
                  />
                </div>

                <!-- Text Content -->
                <Stack gap="xs" align="start" class="w-full flex-1">
                  <div class="flex items-center justify-between w-full gap-sm">
                    <h3 class="text-sm font-semibold text-text-primary transition-colors duration-300 group-hover:text-interactive-accent">
                      {{ cap.title }}
                    </h3>
                    <Badge
                      v-if="cap.badge"
                      variant="accent"
                      class="text-[9px] px-xs py-[1px] uppercase tracking-wider font-mono shrink-0 select-none"
                    >
                      {{ cap.badge }}
                    </Badge>
                  </div>
                  
                  <p class="text-xs text-text-secondary leading-relaxed">
                    {{ cap.description }}
                  </p>
                </Stack>
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
import {
  Workflow,
  Sparkles,
  Keyboard,
  Download,
  Code2,
  Users
} from 'lucide-vue-next'

import Section from './layout/Section.vue'
import Container from './layout/Container.vue'
import Grid from './layout/Grid.vue'
import Stack from './layout/Stack.vue'
import Card from './Card.vue'
import Badge from './Badge.vue'

const sectionRef = ref(null)
const isVisible = ref(false)

const capabilities = [
  {
    title: 'Professional UML Editing',
    description: 'Create classes, interfaces, components, sequences, and other UML diagrams using a clean visual editor.',
    icon: Workflow,
    iconClass: 'group-hover:rotate-6 group-hover:scale-105',
    badge: null
  },
  {
    title: 'Smart Auto Layout',
    description: 'Automatically organize nodes with clean spacing and orthogonal routing while preserving readability.',
    icon: Sparkles,
    iconClass: 'group-hover:rotate-45 group-hover:scale-105',
    badge: null
  },
  {
    title: 'Keyboard-First Workflow',
    description: 'Fast shortcuts, command palette, and rapid editing designed for power users.',
    icon: Keyboard,
    iconClass: 'group-hover:-translate-y-0.5 group-hover:scale-105',
    badge: null
  },
  {
    title: 'Multiple Export Formats',
    description: 'Export diagrams as SVG, PNG, PDF, Markdown, or PlantUML-compatible assets.',
    icon: Download,
    iconClass: 'group-hover:translate-y-0.5 group-hover:scale-105',
    badge: null
  },
  {
    title: 'Developer Friendly',
    description: 'Works directly inside the browser with responsive performance and no installation required.',
    icon: Code2,
    iconClass: 'group-hover:-rotate-6 group-hover:scale-105',
    badge: null
  },
  {
    title: 'Future Collaboration',
    description: 'Architecture prepared for multiplayer editing, shared workspaces, comments, and version history.',
    icon: Users,
    iconClass: 'group-hover:scale-110',
    badge: 'Coming Soon'
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
