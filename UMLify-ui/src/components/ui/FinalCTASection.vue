<template>
  <Section
    ref="sectionRef"
    id="final-cta"
    spacing="xxl"
    custom-class="border-t border-border-default bg-bg-base/30 relative overflow-hidden"
  >
    <Container size="lg">
      <div
        class="w-full transition-all duration-600 ease-tactile transform"
        :class="isVisible ? 'opacity-100 translate-y-0 scale-[1.01]' : 'opacity-0 translate-y-4 scale-100'"
        style="transition-delay: 50ms;"
      >
        <Surface
          depth="2"
          radius="lg"
          custom-class="w-full relative overflow-hidden sheet-grid p-xl md:p-[64px] border border-border-default flex flex-col items-center text-center select-none"
        >
          <!-- Floating SVG Decoration - Left: Mock UML Class Box & Connector -->
          <svg
            class="hidden lg:block absolute left-[5%] top-[20%] w-[180px] h-[120px] pointer-events-none opacity-[0.04] dark:opacity-[0.08] text-text-primary z-0"
            viewBox="0 0 180 120"
            fill="none"
            stroke="currentColor"
            stroke-width="1.5"
            aria-hidden="true"
          >
            <rect x="10" y="10" width="80" height="40" rx="4" />
            <line x1="10" y1="28" x2="90" y2="28" />
            <text x="22" y="22" font-family="sans-serif" font-size="9" font-weight="bold" fill="currentColor">User</text>
            
            <rect x="90" y="70" width="80" height="40" rx="4" />
            <line x1="90" y1="88" x2="170" y2="88" />
            <text x="100" y="82" font-family="sans-serif" font-size="9" font-weight="bold" fill="currentColor">Profile</text>
            
            <path d="M 50 50 L 50 90 L 90 90" stroke-dasharray="3,3" />
            <path d="M 90 90 L 85 87 M 90 90 L 85 93" />
          </svg>

          <!-- Floating SVG Decoration - Right: Mock UML Inheritance / Composition -->
          <svg
            class="hidden lg:block absolute right-[5%] bottom-[15%] w-[160px] h-[140px] pointer-events-none opacity-[0.04] dark:opacity-[0.08] text-text-primary z-0"
            viewBox="0 0 160 140"
            fill="none"
            stroke="currentColor"
            stroke-width="1.5"
            aria-hidden="true"
          >
            <rect x="40" y="10" width="80" height="40" rx="4" />
            <line x1="40" y1="28" x2="120" y2="28" />
            <text x="48" y="22" font-family="sans-serif" font-size="9" font-weight="bold" fill="currentColor">Diagram</text>
            
            <rect x="40" y="90" width="80" height="40" rx="4" />
            <line x1="40" y1="108" x2="120" y2="108" />
            <text x="62" y="102" font-family="sans-serif" font-size="9" font-weight="bold" fill="currentColor">Node</text>
            
            <path d="M 80 50 L 80 90" />
            <polygon points="80,50 75,58 85,58" fill="var(--color-bg-base)" />
          </svg>

          <!-- Content Stack -->
          <Stack gap="lg" align="center" class="relative z-10 w-full max-w-2xl mx-auto">
            
            <!-- Centered Header -->
            <Stack gap="sm" align="center" class="w-full">
              <Badge
                variant="accent"
                class="transition-all duration-500 ease-tactile transform"
                :class="isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'"
                style="transition-delay: 200ms;"
              >
                Ready to Build?
              </Badge>
              
              <h2
                class="text-3xl lg:text-4xl font-bold tracking-tight text-text-primary transition-all duration-500 ease-tactile transform"
                :class="isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'"
                style="transition-delay: 300ms;"
              >
                Design your next software architecture with confidence.
              </h2>
              
              <p
                class="text-sm text-text-secondary leading-relaxed transition-all duration-500 ease-tactile transform"
                :class="isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'"
                style="transition-delay: 400ms;"
              >
                Umlify lets developers move from ideas to professional UML diagrams inside the browser without unnecessary complexity.
              </p>
            </Stack>

            <!-- Actions Row (Stacked on Mobile, Inline on Desktop) -->
            <div
              class="flex flex-col sm:flex-row items-center justify-center gap-sm mt-md w-full sm:w-auto transition-all duration-500 transform"
              :class="isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'"
              style="transition-delay: 500ms;"
            >
              <Button
                variant="primary"
                size="md"
                class="w-full sm:w-auto px-lg"
                @click="launchEditor"
              >
                Launch Editor
              </Button>
              <Button
                variant="secondary"
                size="md"
                class="w-full sm:w-auto px-lg"
                @click="exploreDocs"
              >
                Explore Documentation
              </Button>
            </div>

            <!-- Trust Badges Row -->
            <div
              class="flex flex-wrap items-center justify-center gap-xs mt-md select-none transition-all duration-500 transform"
              :class="isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'"
              style="transition-delay: 600ms;"
            >
              <Badge variant="neutral">✓ Browser Based</Badge>
              <Badge variant="neutral">✓ Free Community Edition</Badge>
              <Badge variant="neutral">✓ SVG Export</Badge>
              <Badge variant="neutral">✓ Keyboard First</Badge>
            </div>

          </Stack>
        </Surface>
      </div>
    </Container>
  </Section>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'

import Section from './layout/Section.vue'
import Container from './layout/Container.vue'
import Stack from './layout/Stack.vue'
import Badge from './Badge.vue'
import Surface from './layout/Surface.vue'
import Button from './Button.vue'

const router = useRouter()
const sectionRef = ref(null)
const isVisible = ref(false)

const launchEditor = () => {
  router.push('/workspace')
}

const exploreDocs = () => {
  // Gracefully scroll to FAQs as documentation representation
  const faqEl = document.getElementById('faq')
  if (faqEl) {
    faqEl.scrollIntoView({ behavior: 'smooth' })
  } else {
    window.location.hash = '#faq'
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
