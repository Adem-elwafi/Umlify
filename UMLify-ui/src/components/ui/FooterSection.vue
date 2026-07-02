<template>
  <footer
    ref="footerRef"
    class="w-full border-t border-border-default bg-bg-base/30 py-xl lg:py-[64px] relative overflow-hidden transition-all duration-700 ease-tactile transform"
    :class="isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'"
  >
    <Container size="lg">
      <!-- 5-Column Grid -->
      <Grid
        cols="5"
        cols-tablet="2"
        cols-mobile="1"
        gap="xl"
        class="w-full"
      >
        <!-- Column 1: Brand Info -->
        <Stack gap="sm">
          <router-link to="/" class="flex items-center gap-xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-interactive-accent rounded select-none w-fit">
            <svg class="h-5 w-5 text-interactive-accent" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
              <rect x="3" y="3" width="7" height="7" rx="1.5" />
              <rect x="14" y="14" width="7" height="7" rx="1.5" />
              <path stroke-linecap="round" d="M10 6.5h4M10 17.5h4M6.5 10v4M17.5 10v4" />
            </svg>
            <span class="font-sans font-bold text-base tracking-tight text-text-primary">
              Umlify
            </span>
          </router-link>
          <p class="text-xs text-text-secondary leading-relaxed max-w-[200px]">
            Design software architecture with clarity.
          </p>
          <div class="w-fit">
            <Badge variant="neutral" class="text-[9px] uppercase font-mono tracking-wider px-xs py-xxs">
              Alpha v0.1
            </Badge>
          </div>
        </Stack>

        <!-- Column 2: Product -->
        <Stack gap="sm">
          <h4 class="text-xs font-bold uppercase tracking-wider text-text-muted select-none">
            Product
          </h4>
          <nav class="flex flex-col gap-xs text-xs font-medium">
            <a href="#features" class="text-text-secondary hover:text-text-primary hover:underline transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-interactive-accent rounded px-xxs py-xxs w-fit">Features</a>
            <a href="#templates" class="text-text-secondary hover:text-text-primary hover:underline transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-interactive-accent rounded px-xxs py-xxs w-fit">Diagram Types</a>
            <a href="#pricing" class="text-text-secondary hover:text-text-primary hover:underline transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-interactive-accent rounded px-xxs py-xxs w-fit">Pricing</a>
            <a href="#roadmap" class="text-text-secondary hover:text-text-primary hover:underline transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-interactive-accent rounded px-xxs py-xxs w-fit">Roadmap</a>
            <a href="#faq" class="text-text-secondary hover:text-text-primary hover:underline transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-interactive-accent rounded px-xxs py-xxs w-fit">FAQ</a>
          </nav>
        </Stack>

        <!-- Column 3: Resources -->
        <Stack gap="sm">
          <h4 class="text-xs font-bold uppercase tracking-wider text-text-muted select-none">
            Resources
          </h4>
          <nav class="flex flex-col gap-xs text-xs font-medium">
            <a href="#" class="text-text-secondary hover:text-text-primary hover:underline transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-interactive-accent rounded px-xxs py-xxs w-fit">Documentation</a>
            <a href="https://github.com" target="_blank" rel="noopener noreferrer" class="text-text-secondary hover:text-text-primary hover:underline transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-interactive-accent rounded px-xxs py-xxs w-fit">GitHub</a>
            <a href="#" class="text-text-secondary hover:text-text-primary hover:underline transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-interactive-accent rounded px-xxs py-xxs w-fit">Changelog</a>
            <a href="#" class="text-text-secondary hover:text-text-primary hover:underline transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-interactive-accent rounded px-xxs py-xxs w-fit">Release Notes</a>
            <a href="#" class="text-text-secondary hover:text-text-primary hover:underline transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-interactive-accent rounded px-xxs py-xxs w-fit">Developer Guide</a>
          </nav>
        </Stack>

        <!-- Column 4: Legal -->
        <Stack gap="sm">
          <h4 class="text-xs font-bold uppercase tracking-wider text-text-muted select-none">
            Legal
          </h4>
          <nav class="flex flex-col gap-xs text-xs font-medium">
            <a href="#" class="text-text-secondary hover:text-text-primary hover:underline transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-interactive-accent rounded px-xxs py-xxs w-fit">Privacy</a>
            <a href="#" class="text-text-secondary hover:text-text-primary hover:underline transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-interactive-accent rounded px-xxs py-xxs w-fit">Terms</a>
            <a href="#" class="text-text-secondary hover:text-text-primary hover:underline transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-interactive-accent rounded px-xxs py-xxs w-fit">License</a>
          </nav>
        </Stack>

        <!-- Column 5: Settings & Socials -->
        <Stack gap="sm" class="lg:items-end">
          <h4 class="text-xs font-bold uppercase tracking-wider text-text-muted select-none lg:text-right w-full">
            Settings
          </h4>
          <Stack gap="md" align="start" class="lg:items-end w-full">
            <!-- Theme Toggle -->
            <div class="flex items-center gap-xs">
              <span class="text-xs text-text-secondary font-medium select-none">Theme</span>
              <Button
                variant="secondary"
                size="sm"
                class="px-xs py-xxs focus-visible:outline-none"
                aria-label="Toggle theme"
                @click="toggleTheme"
              >
                <!-- Sun Icon (visible in dark mode) -->
                <svg v-if="isDark" class="h-4 w-4 text-text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                  <circle cx="12" cy="12" r="5" fill="none" />
                  <path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" stroke-linecap="round" />
                </svg>
                <!-- Moon Icon (visible in light mode) -->
                <svg v-else class="h-4 w-4 text-text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                  <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" stroke-linecap="round" stroke-linejoin="round" />
                </svg>
              </Button>
            </div>

            <!-- Social Links -->
            <div class="flex items-center gap-xs">
              <!-- GitHub Link -->
              <a
                href="https://github.com"
                target="_blank"
                rel="noopener noreferrer"
                class="text-text-secondary hover:text-text-primary transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-interactive-accent rounded p-xxs"
                aria-label="GitHub"
              >
                <svg class="h-4 w-4 transition-transform duration-350 hover:scale-110" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22" />
                </svg>
              </a>

              <!-- Discord Link -->
              <a
                href="#"
                class="text-text-secondary hover:text-text-primary transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-interactive-accent rounded p-xxs"
                aria-label="Discord"
              >
                <svg class="h-4 w-4 transition-transform duration-350 hover:scale-110" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <circle cx="12" cy="12" r="10" />
                  <path d="M8.5 14.5A2.5 2.5 0 0 0 11 12M15.5 14.5A2.5 2.5 0 0 1 13 12" />
                  <path d="M8 9.5c0-1.5 1.8-3 4-3s4 1.5 4 3c0 1.2-1 2.2-2.5 2.5h-3C9 11.7 8 10.7 8 9.5z" />
                </svg>
              </a>

              <!-- LinkedIn Link -->
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noopener noreferrer"
                class="text-text-secondary hover:text-text-primary transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-interactive-accent rounded p-xxs"
                aria-label="LinkedIn"
              >
                <svg class="h-4 w-4 transition-transform duration-350 hover:scale-110" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
                  <rect x="2" y="9" width="4" height="12" />
                  <circle cx="4" cy="4" r="2" />
                </svg>
              </a>
            </div>
          </Stack>
        </Stack>
      </Grid>

      <Divider class="my-xl" />

      <!-- Bottom Credits Section -->
      <div class="flex flex-col sm:flex-row items-center justify-between gap-md text-xs text-text-secondary pb-lg">
        <span class="select-none">
          © 2026 Umlify. All rights reserved.
        </span>
        
        <div class="flex flex-wrap items-center gap-xs">
          <span class="text-xxs font-mono uppercase tracking-wider text-text-muted mr-xs select-none">Built with</span>
          <Badge variant="neutral">Vue</Badge>
          <Badge variant="neutral">TypeScript</Badge>
          <Badge variant="neutral">Tailwind v4</Badge>
          <Badge variant="neutral">Vite</Badge>
          <Badge variant="neutral">Lucide</Badge>
        </div>
      </div>
    </Container>
  </footer>
</template>

<script setup>
import { ref, onMounted } from 'vue'

import Container from './layout/Container.vue'
import Grid from './layout/Grid.vue'
import Stack from './layout/Stack.vue'
import Badge from './Badge.vue'
import Divider from './Divider.vue'
import Button from './Button.vue'

const footerRef = ref(null)
const isVisible = ref(false)
const isDark = ref(false)

const toggleTheme = () => {
  isDark.value = !isDark.value
  if (isDark.value) {
    document.documentElement.classList.add('dark')
    localStorage.setItem('theme', 'dark')
  } else {
    document.documentElement.classList.remove('dark')
    localStorage.setItem('theme', 'light')
  }
}

onMounted(() => {
  isDark.value = document.documentElement.classList.contains('dark') || localStorage.getItem('theme') === 'dark'
  if (isDark.value) {
    document.documentElement.classList.add('dark')
  } else {
    document.documentElement.classList.remove('dark')
  }

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
      threshold: 0.05,
      rootMargin: '0px'
    }
  )

  if (footerRef.value) {
    observer.observe(footerRef.value)
  }
})
</script>

<style scoped>
@media (prefers-reduced-motion: reduce) {
  .transform,
  .transition-all,
  footer {
    transition: none !important;
    transform: none !important;
    animation: none !important;
    opacity: 1 !important;
  }
}
</style>
