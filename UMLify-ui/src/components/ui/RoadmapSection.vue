<template>
  <Section
    ref="sectionRef"
    id="roadmap"
    spacing="xxl"
    custom-class="border-t border-border-default bg-bg-base/40 relative overflow-hidden"
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
    <Container size="lg">
      <Stack gap="xl" class="w-full">
        <!-- Section Header (Centered) -->
        <Stack gap="sm" align="center" class="text-center max-w-2xl mx-auto">
          <Badge
            variant="accent"
            class="transition-all duration-500 ease-tactile transform"
            :class="isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'"
            style="transition-delay: 50ms;"
          >
            Open Development
          </Badge>
          
          <h2
            class="text-3xl lg:text-4xl font-bold tracking-tight text-text-primary transition-all duration-500 ease-tactile transform"
            :class="isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'"
            style="transition-delay: 150ms;"
          >
            Building the future of browser-based UML design.
          </h2>
          
          <p
            class="text-sm text-text-secondary leading-relaxed transition-all duration-500 ease-tactile transform"
            :class="isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'"
            style="transition-delay: 250ms;"
          >
            Umlify is being built incrementally with a strong focus on engineering quality, usability, performance, and long-term maintainability.
          </p>
        </Stack>

        <!-- Vertical Timeline Container -->
        <div class="relative w-full mt-lg">
          <!-- Milestones List -->
          <div class="flex flex-col gap-y-6 md:gap-y-8 lg:gap-y-12">
            <div
              v-for="(item, index) in milestones"
              :key="item.title"
              class="relative w-full min-h-[96px]"
            >
              <!-- Vertical Line Segment -->
              <div
                class="absolute left-6 lg:left-1/2 w-[2px] bg-border-default -translate-x-1/2 pointer-events-none"
                :class="[
                  index === 0 ? 'top-[24px]' : 'top-0',
                  index === milestones.length - 1 ? 'h-[24px]' : 'bottom-0'
                ]"
              ></div>

              <!-- Timeline Node (Indicator) -->
              <div
                class="absolute left-6 lg:left-1/2 top-[24px] -translate-x-1/2 -translate-y-1/2 z-10 flex items-center justify-center pointer-events-none"
              >
                <!-- Completed Indicator -->
                <div
                  v-if="item.status === 'completed'"
                  class="w-7 h-7 rounded-full bg-success/15 border-2 border-success text-success flex items-center justify-center text-[10px] font-bold select-none"
                  aria-hidden="true"
                >
                  ✓
                </div>
                <!-- Current (In Progress) Indicator -->
                <div
                  v-else-if="item.status === 'current'"
                  class="w-7 h-7 rounded-full bg-interactive-accent/15 border-2 border-interactive-accent text-interactive-accent flex items-center justify-center text-xs font-bold select-none relative"
                  aria-hidden="true"
                >
                  <span class="absolute inset-0 rounded-full border-2 border-interactive-accent/50 animate-ping"></span>
                  <span class="w-2.5 h-2.5 rounded-full bg-interactive-accent animate-pulse-accent"></span>
                </div>
                <!-- Planned / Upcoming Indicator -->
                <div
                  v-else
                  class="w-7 h-7 rounded-full bg-bg-surface border-2 border-border-default text-text-muted flex items-center justify-center text-[10px] font-bold select-none"
                  aria-hidden="true"
                >
                  ○
                </div>
              </div>

              <!-- Content (Card) -->
              <!-- Tablet: slightly compressed spacing. Mobile: single column. Desktop: centered/alternating. -->
              <div
                class="pl-16 pr-xs lg:px-0 w-full flex transition-all duration-500 ease-tactile transform"
                :class="[
                  index % 2 === 0 
                    ? 'lg:w-1/2 lg:mr-auto lg:ml-0 lg:justify-end lg:pr-12' 
                    : 'lg:w-1/2 lg:ml-auto lg:mr-0 lg:justify-start lg:pl-12',
                  isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
                ]"
                :style="{ transitionDelay: `${(index * 75) + 350}ms` }"
              >
                <Card
                  hoverable
                  tabindex="0"
                  custom-class="w-full max-w-[480px] focus-visible:bg-bg-elevated focus-visible:border-border-elevated focus-visible:translate-y-[-2px] focus-visible:shadow-lg focus-visible:ring-2 focus-visible:ring-interactive-accent focus-visible:outline-none"
                >
                  <Stack gap="xs">
                    <Stack direction="row" align="center" justify="between" class="w-full">
                      <h3 class="text-sm font-bold text-text-primary">
                        {{ item.title }}
                      </h3>
                      <Badge :variant="item.badgeVariant">
                        {{ item.statusLabel }}
                      </Badge>
                    </Stack>
                    <p class="text-xs text-text-secondary leading-relaxed">
                      {{ item.description }}
                    </p>
                  </Stack>
                </Card>
              </div>
            </div>
          </div>
        </div>
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
import Card from './Card.vue'

const sectionRef = ref(null)
const isVisible = ref(false)

const milestones = [
  {
    title: 'Design System',
    description: 'Establish the visual identity, core typography scales, color palettes, and reusable UI primitives.',
    status: 'completed',
    statusLabel: 'Completed',
    badgeVariant: 'success'
  },
  {
    title: 'Landing Experience',
    description: 'Build a high-conversion, performance-optimized homepage showcasing the core capabilities and interactive editor tour.',
    status: 'completed',
    statusLabel: 'Completed',
    badgeVariant: 'success'
  },
  {
    title: 'UML Diagram Engine',
    description: 'Develop the core rendering engine for nodes, edges, connections, reactivity, and snapping constraints.',
    status: 'completed',
    statusLabel: 'Completed',
    badgeVariant: 'success'
  },
  {
    title: 'Workspace Editor',
    description: 'Launch the primary canvas workspace, supporting interactive drag-and-drop modeling, grid controls, and node creation.',
    status: 'current',
    statusLabel: 'In Progress',
    badgeVariant: 'accent'
  },
  {
    title: 'Keyboard Workflow',
    description: 'Implement a comprehensive keyboard-driven system to navigate, edit, and connect nodes without a mouse.',
    status: 'planned',
    statusLabel: 'Planned',
    badgeVariant: 'neutral'
  },
  {
    title: 'Command Palette',
    description: 'Create a keyboard-accessible command menu for instant actions, shortcuts, formatting, and file exports.',
    status: 'planned',
    statusLabel: 'Planned',
    badgeVariant: 'neutral'
  },
  {
    title: 'Smart Auto Layout',
    description: 'Integrate layout algorithms to automatically clean up, route connections, and format complex diagram structures.',
    status: 'planned',
    statusLabel: 'Planned',
    badgeVariant: 'neutral'
  },
  {
    title: 'Real-time Collaboration',
    description: 'Enable multiplayer editing, live cursor tracking, and cloud sync for remote engineering teams.',
    status: 'planned',
    statusLabel: 'Planned',
    badgeVariant: 'neutral'
  },
  {
    title: 'AI Assisted Modeling',
    description: 'Support natural language-to-diagram generations, auto-complete connections, and automated design validation.',
    status: 'planned',
    statusLabel: 'Planned',
    badgeVariant: 'neutral'
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
@keyframes pulse-accent {
  0%, 100% {
    transform: scale(1);
    opacity: 1;
  }
  50% {
    transform: scale(1.15);
    opacity: 0.85;
  }
}

.animate-pulse-accent {
  animation: pulse-accent 2s cubic-bezier(0.16, 1, 0.3, 1) infinite;
}

@media (prefers-reduced-motion: reduce) {
  .transform,
  .transition-all {
    transition: none !important;
    transform: none !important;
    animation: none !important;
    opacity: 1 !important;
  }
  
  .animate-ping,
  .animate-pulse-accent {
    animation: none !important;
  }
}
</style>
