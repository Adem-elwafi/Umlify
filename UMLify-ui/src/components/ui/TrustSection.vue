<template>
  <Section
    ref="sectionRef"
    id="trust"
    spacing="xxl"
    custom-class="border-t border-border-default bg-bg-base/40 relative overflow-hidden"
  >
    <Container size="lg">
      <Stack gap="xxl" class="w-full">
        
        <!-- Header (Centered) -->
        <Stack gap="sm" align="center" class="text-center max-w-2xl mx-auto">
          <Badge
            variant="accent"
            class="transition-all duration-500 ease-tactile transform"
            :class="isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'"
            style="transition-delay: 50ms;"
          >
            Trusted Engineering Workflow
          </Badge>
          
          <h2
            class="text-3xl lg:text-4xl font-bold tracking-tight text-text-primary transition-all duration-500 ease-tactile transform"
            :class="isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'"
            style="transition-delay: 150ms;"
          >
            Built for developers who care about architecture.
          </h2>
          
          <p
            class="text-sm text-text-secondary leading-relaxed transition-all duration-500 ease-tactile transform"
            :class="isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'"
            style="transition-delay: 250ms;"
          >
            Umlify is designed for software engineers, architects, students, and technical teams who want diagrams that remain clean, maintainable, and easy to evolve.
          </p>
        </Stack>

        <!-- Block 1: Statistics Grid -->
        <div class="w-full">
          <Grid
            cols="4"
            cols-tablet="2"
            cols-mobile="1"
            gap="md"
            class="w-full"
          >
            <div
              v-for="(s, index) in stats"
              :key="s.title"
              class="h-full transition-all duration-500 ease-tactile transform"
              :class="[
                isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
              ]"
              :style="{ transitionDelay: `${(index * 75) + 350}ms` }"
            >
              <Card
                hoverable
                tabindex="0"
                custom-class="h-full focus-visible:bg-bg-elevated focus-visible:border-border-elevated focus-visible:translate-y-[-2px] focus-visible:shadow-lg focus-visible:ring-2 focus-visible:ring-interactive-accent focus-visible:outline-none"
              >
                <Stack gap="xs">
                  <span class="text-3xl lg:text-4xl font-bold font-mono text-interactive-accent select-none">
                    {{ s.value }}
                  </span>
                  <h3 class="text-xs font-bold text-text-primary">
                    {{ s.title }}
                  </h3>
                  <p class="text-xxs text-text-secondary leading-relaxed">
                    {{ s.description }}
                  </p>
                </Stack>
              </Card>
            </div>
          </Grid>
        </div>

        <!-- Divider -->
        <Divider
          class="transition-all duration-700"
          :class="isVisible ? 'opacity-100 scale-x-100' : 'opacity-0 scale-x-95'"
          style="transition-delay: 650ms;"
        />

        <!-- Block 2: Testimonials Grid -->
        <div class="w-full">
          <Grid
            cols="3"
            cols-tablet="3"
            cols-mobile="1"
            gap="md"
            class="w-full"
          >
            <div
              v-for="(t, index) in testimonials"
              :key="t.author"
              class="h-full transition-all duration-500 ease-tactile transform"
              :class="[
                isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
              ]"
              :style="{ transitionDelay: `${(index * 75) + 700}ms` }"
            >
              <Card
                hoverable
                tabindex="0"
                custom-class="h-full focus-visible:bg-bg-elevated focus-visible:border-border-elevated focus-visible:translate-y-[-2px] focus-visible:shadow-lg focus-visible:ring-2 focus-visible:ring-interactive-accent focus-visible:outline-none bg-bg-base/20 border border-border-default/60"
              >
                <Stack gap="md" justify="between" class="h-full">
                  <p class="text-xs text-text-primary leading-relaxed">
                    "{{ t.quote }}"
                  </p>
                  <Stack gap="none">
                    <span class="text-[11px] font-bold text-text-primary">
                      {{ t.author }}
                    </span>
                    <span class="text-[9px] font-mono text-text-muted uppercase tracking-wider select-none">
                      {{ t.role }}
                    </span>
                  </Stack>
                </Stack>
              </Card>
            </div>
          </Grid>
        </div>

        <!-- Divider -->
        <Divider
          class="transition-all duration-700"
          :class="isVisible ? 'opacity-100 scale-x-100' : 'opacity-0 scale-x-95'"
          style="transition-delay: 950ms;"
        />

        <!-- Block 3: Engineering Principles -->
        <div
          class="w-full transition-all duration-500 transform"
          :class="isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'"
          style="transition-delay: 1000ms;"
        >
          <Grid
            cols="12"
            cols-tablet="12"
            cols-mobile="1"
            gap="lg"
            class="items-start"
          >
            <!-- Left Column: Heading -->
            <div class="col-span-12 lg:col-span-4">
              <Stack gap="xs">
                <h3 class="text-sm font-bold uppercase tracking-wider text-text-muted">
                  Engineering Principles
                </h3>
                <p class="text-xs text-text-secondary leading-relaxed max-w-sm">
                  We adhere to strict engineering values to build a tool that remains fast, compliant, privacy-first, and highly productive.
                </p>
              </Stack>
            </div>

            <!-- Right Column: Vertical Checklist -->
            <div class="col-span-12 lg:col-span-8">
              <Grid
                cols="2"
                cols-tablet="2"
                cols-mobile="1"
                gap="md"
              >
                <div
                  v-for="p in principles"
                  :key="p"
                  class="flex items-center gap-xs text-xs font-semibold text-text-primary focus-visible:outline-none select-none"
                >
                  <svg
                    class="h-4 w-4 text-success shrink-0"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    stroke-width="3"
                    aria-hidden="true"
                  >
                    <path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                  <span>{{ p }}</span>
                </div>
              </Grid>
            </div>
          </Grid>
        </div>

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
import Card from './Card.vue'
import Divider from './Divider.vue'

const sectionRef = ref(null)
const isVisible = ref(false)

const stats = [
  {
    value: '100%',
    title: 'Browser Based',
    description: 'Diagram compiler and canvas updates run completely locally in your client.'
  },
  {
    value: '< 10ms',
    title: 'Render Latency',
    description: 'Highly optimized, hardware-accelerated reactivity with zero-lag interactions.'
  },
  {
    value: '1:1',
    title: 'SVG Precision',
    description: 'Clean vector shapes adhering precisely to official UML 2.5 structures.'
  },
  {
    value: '0',
    title: 'Setup Steps',
    description: 'No installations, desktop downloads, or account creations required to build.'
  }
]

const testimonials = [
  {
    quote: 'Exactly the UML editor I wanted during software architecture courses.',
    author: 'CS Student',
    role: 'University Education'
  },
  {
    quote: 'The keyboard workflow feels incredibly fast compared to traditional editors.',
    author: 'Frontend Developer',
    role: 'Product Development'
  },
  {
    quote: 'The clean exports make documentation much easier.',
    author: 'Software Architect',
    role: 'Enterprise Systems'
  }
]

const principles = [
  'No installation',
  'Keyboard-first',
  'UML compliant',
  'Accessible',
  'Responsive',
  'Fast rendering',
  'Clean exports',
  'Privacy friendly'
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
