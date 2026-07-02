<template>
  <Section
    ref="sectionRef"
    id="pricing"
    spacing="xxl"
    custom-class="border-t border-border-default bg-bg-base/30 relative overflow-hidden"
  >
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
            Simple Pricing
          </Badge>
          
          <h2
            class="text-3xl lg:text-4xl font-bold tracking-tight text-text-primary transition-all duration-500 ease-tactile transform"
            :class="isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'"
            style="transition-delay: 150ms;"
          >
            Start building diagrams in minutes.
          </h2>
          
          <p
            class="text-sm text-text-secondary leading-relaxed transition-all duration-500 ease-tactile transform"
            :class="isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'"
            style="transition-delay: 250ms;"
          >
            Umlify is designed to be accessible for students, individual developers, and engineering teams, with a straightforward pricing philosophy.
          </p>
        </Stack>

        <!-- Pricing Cards Grid -->
        <div class="w-full mt-lg">
          <Grid
            cols="3"
            cols-tablet="2"
            cols-mobile="1"
            gap="lg"
            class="w-full items-stretch"
          >
            <div
              v-for="(plan, index) in plans"
              :key="plan.name"
              class="w-full h-full flex flex-col transition-all duration-500 ease-tactile transform"
              :class="isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'"
              :style="{ transitionDelay: `${(index * 100) + 350}ms` }"
            >
              <Card
                :hoverable="true"
                :depth="plan.highlighted ? '2' : '1'"
                :custom-class="[
                  'w-full h-full flex flex-col justify-between border',
                  plan.highlighted ? 'border-interactive-accent ring-1 ring-interactive-accent/30 bg-bg-surface/50' : 'border-border-default',
                  focusedIndex === index ? 'ring-2 ring-interactive-accent border-interactive-accent translate-y-[-2px] shadow-lg bg-bg-elevated/45' : ''
                ].join(' ')"
              >
                <div class="flex flex-col h-full justify-between">
                <div>
                  <!-- Header info -->
                  <Stack gap="xs">
                    <Stack direction="row" align="center" justify="between" class="w-full">
                      <h3 class="text-xs font-bold text-text-primary uppercase tracking-wider">
                        {{ plan.name }}
                      </h3>
                      <Badge v-if="plan.badge" variant="accent">
                        {{ plan.badge }}
                      </Badge>
                    </Stack>
                    
                    <div class="my-sm flex items-baseline">
                      <span class="text-3xl font-bold font-mono text-text-primary tracking-tight">
                        {{ plan.price }}
                      </span>
                    </div>
                    
                    <p class="text-xs text-text-secondary leading-relaxed min-h-[32px]">
                      {{ plan.description }}
                    </p>
                  </Stack>

                  <Divider class="my-md" />

                  <!-- Features List -->
                  <Stack gap="sm">
                    <span class="text-[9px] font-mono uppercase tracking-widest text-text-muted">
                      Features
                    </span>
                    <Stack gap="xs">
                      <div
                        v-for="feat in plan.features"
                        :key="feat"
                        class="flex items-start gap-xs text-xs text-text-secondary select-none"
                      >
                        <svg
                          class="h-4 w-4 text-success shrink-0 mt-xxs"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                          stroke-width="3"
                          aria-hidden="true"
                        >
                          <path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7" />
                        </svg>
                        <span>{{ feat }}</span>
                      </div>
                    </Stack>
                  </Stack>
                </div>

                <!-- Action Button -->
                <div class="mt-lg">
                  <Button
                    :variant="plan.buttonVariant"
                    full
                    @focus="focusedIndex = index"
                    @blur="focusedIndex = null"
                  >
                    {{ plan.buttonText }}
                  </Button>
                </div>
              </div>
            </Card>
          </div>
          </Grid>
        </div>

        <!-- Bottom Information Disclaimer -->
        <p
          class="text-xxs text-text-muted text-center leading-relaxed transition-all duration-500 transform"
          :class="isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'"
          style="transition-delay: 750ms;"
        >
          No hidden fees. Cancel anytime. Community edition remains free.
        </p>

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
import Button from './Button.vue'

const sectionRef = ref(null)
const isVisible = ref(false)
const focusedIndex = ref(null)

const plans = [
  {
    name: 'Community',
    price: 'Free',
    description: 'Perfect for students and personal projects.',
    features: [
      'Browser editor',
      'UML diagrams',
      'SVG export',
      'PNG export',
      'Local projects'
    ],
    buttonText: 'Start Free',
    buttonVariant: 'secondary',
    highlighted: false,
    badge: null
  },
  {
    name: 'Professional',
    price: 'Coming Soon',
    description: 'Built for professional developers.',
    features: [
      'Everything in Community',
      'Unlimited projects',
      'Cloud sync',
      'Version history',
      'Collaboration',
      'Premium exports',
      'Priority support'
    ],
    buttonText: 'Join Waitlist',
    buttonVariant: 'primary',
    highlighted: true,
    badge: 'Recommended'
  },
  {
    name: 'Enterprise',
    price: 'Contact Us',
    description: 'For engineering organizations.',
    features: [
      'Team workspaces',
      'SSO',
      'Audit logs',
      'Organization management',
      'Dedicated support'
    ],
    buttonText: 'Contact',
    buttonVariant: 'secondary',
    highlighted: false,
    badge: null
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
  .transform,
  .transition-all {
    transition: none !important;
    transform: none !important;
    animation: none !important;
    opacity: 1 !important;
  }
}
</style>
