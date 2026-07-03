<template>
  <Section
    ref="sectionRef"
    id="faq"
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
            Frequently Asked Questions
          </Badge>
          
          <h2
            class="text-3xl lg:text-4xl font-bold tracking-tight text-text-primary transition-all duration-500 ease-tactile transform"
            :class="isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'"
            style="transition-delay: 150ms;"
          >
            Questions developers usually ask.
          </h2>
          
          <p
            class="text-sm text-text-secondary leading-relaxed transition-all duration-500 ease-tactile transform"
            :class="isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'"
            style="transition-delay: 250ms;"
          >
            Common technical questions regarding Umlify’s architecture, capabilities, rendering engine, and feature roadmap.
          </p>
        </Stack>

        <!-- Accordion Container -->
        <div class="w-full max-w-3xl mx-auto mt-lg">
          <Stack gap="sm">
            <div
              v-for="(item, index) in faqs"
              :key="item.question"
              class="w-full transition-all duration-500 ease-tactile transform"
              :class="isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'"
              :style="{ transitionDelay: `${(index * 75) + 350}ms` }"
            >
              <Card
                hoverable
                :custom-class="[
                  'w-full',
                  activeIndex === index ? 'border-border-elevated bg-bg-base/35 shadow-sm' : '',
                  focusedIndex === index ? 'ring-2 ring-interactive-accent border-interactive-accent translate-y-[-2px] shadow-lg bg-bg-elevated/45' : ''
                ].join(' ')"
              >
                <div class="flex flex-col">
                <!-- Accordion Header Button -->
                <h3 class="w-full flex">
                  <button
                    :ref="el => { if (el) buttonRefs[index] = el }"
                    :id="'faq-btn-' + index"
                    role="button"
                    :aria-expanded="activeIndex === index ? 'true' : 'false'"
                    :aria-controls="'faq-content-' + index"
                    class="w-full text-left flex items-center justify-between font-bold text-sm text-text-primary focus-visible:outline-none cursor-pointer py-xxs select-none"
                    @click="toggleItem(index)"
                    @keydown="handleKeyDown($event, index)"
                    @focus="focusedIndex = index"
                    @blur="focusedIndex = null"
                  >
                    <span class="pr-md">{{ item.question }}</span>
                    <!-- Chevron Icon -->
                    <svg
                      class="h-4 w-4 text-text-secondary transition-transform duration-300 ease-tactile shrink-0"
                      :class="{ 'rotate-180': activeIndex === index }"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      stroke-width="2.5"
                    >
                      <path stroke-linecap="round" stroke-linejoin="round" d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                </h3>

                <!-- Accordion Content (Smooth height animation) -->
                <div
                  :id="'faq-content-' + index"
                  role="region"
                  :aria-labelledby="'faq-btn-' + index"
                  class="faq-grid"
                  :class="{ 'is-open': activeIndex === index }"
                >
                  <div class="overflow-hidden">
                    <div class="pt-sm border-t border-border-default/60 mt-sm">
                      <p class="text-xs text-text-secondary leading-relaxed">
                        {{ item.answer }}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          </div>
          </Stack>
        </div>
      </Stack>
    </Container>
  </Section>
</template>

<script setup>
import { ref, onMounted, onBeforeUpdate } from 'vue'

import Section from './layout/Section.vue'
import Container from './layout/Container.vue'
import Stack from './layout/Stack.vue'
import Badge from './Badge.vue'
import Card from './Card.vue'

const sectionRef = ref(null)
const isVisible = ref(false)
const activeIndex = ref(null)
const focusedIndex = ref(null)
const buttonRefs = ref([])

onBeforeUpdate(() => {
  buttonRefs.value = []
})

const faqs = [
  {
    question: 'Does Umlify run completely in the browser?',
    answer: 'Yes, Umlify is built as a client-side web application. All diagrams, models, and states are rendered and compiled directly in your browser. There is no desktop software to install, and all canvas operations occur locally.'
  },
  {
    question: 'Can I export my diagrams?',
    answer: 'Absolutely. You can export your diagrams in various standard formats including SVG (with embedded metadata), PNG, PDF, and JSON. We also support copying PlantUML and Mermaid text structures directly to your clipboard for external tool compatibility.'
  },
  {
    question: 'Which UML diagrams are supported?',
    answer: 'We currently support Class, Sequence, Use Case, Activity, Component, and State diagrams. Our design system and canvas engine are modular, allowing us to roll out support for additional diagram types incrementally.'
  },
  {
    question: 'Will collaboration be available?',
    answer: 'Real-time multiplayer collaboration is a major milestone on our active roadmap. We plan to integrate CRDT-based synchronized model states, live cursor tracking, and collaborative workspaces for engineering teams.'
  },
  {
    question: 'Is Umlify open source?',
    answer: 'No, the core Umlify web application and canvas engine are closed source. However, we publish our design token system, roadmap progress, and architectural guides openly to build trust and engineering transparency.'
  },
  {
    question: 'Can I use Umlify offline?',
    answer: 'Currently, Umlify requires a network connection to load the application assets. Once loaded, the diagram editor runs client-side and can perform editing tasks without network calls. We plan to introduce full offline-first PWA support in a future release.'
  }
]

const toggleItem = (index) => {
  activeIndex.value = activeIndex.value === index ? null : index
}

const handleKeyDown = (event, index) => {
  const lastIndex = faqs.length - 1
  
  if (event.key === 'ArrowDown') {
    event.preventDefault()
    const nextIndex = index === lastIndex ? 0 : index + 1
    buttonRefs.value[nextIndex]?.focus()
  } else if (event.key === 'ArrowUp') {
    event.preventDefault()
    const prevIndex = index === 0 ? lastIndex : index - 1
    buttonRefs.value[prevIndex]?.focus()
  } else if (event.key === 'Home') {
    event.preventDefault()
    buttonRefs.value[0]?.focus()
  } else if (event.key === 'End') {
    event.preventDefault()
    buttonRefs.value[lastIndex]?.focus()
  }
}

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
.faq-grid {
  display: grid;
  grid-template-rows: 0fr;
  transition: grid-template-rows 300ms cubic-bezier(0.16, 1, 0.3, 1), opacity 200ms cubic-bezier(0.16, 1, 0.3, 1);
  opacity: 0;
}

.faq-grid.is-open {
  grid-template-rows: 1fr;
  opacity: 1;
}

@media (prefers-reduced-motion: reduce) {
  .transform,
  .transition-all,
  .faq-grid {
    transition: none !important;
    transform: none !important;
    animation: none !important;
    opacity: 1 !important;
  }
  
  .faq-grid {
    grid-template-rows: 1fr !important;
  }
}
</style>
