<template>
  <header
    class="sticky top-0 w-full border-b transition-all duration-350 ease-tactile z-navigation transform"
    :class="[
      isScrolled 
        ? 'bg-bg-base/95 backdrop-blur-lg border-border-elevated shadow-sm' 
        : 'bg-bg-base/70 backdrop-blur-md border-border-default',
      isMounted 
        ? 'opacity-100 translate-y-0' 
        : 'opacity-0 -translate-y-4'
    ]"
  >
    <Container size="2xl">
      <div class="h-14 flex items-center justify-between">
        
        <!-- Left: Brand Logo & Title -->
        <router-link to="/" class="flex items-center gap-xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-interactive-accent rounded select-none">
          <!-- Logo Symbol (Geometric abstract UML node shape) -->
          <svg class="h-5 w-5 text-interactive-accent" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
            <rect x="3" y="3" width="7" height="7" rx="1.5" />
            <rect x="14" y="14" width="7" height="7" rx="1.5" />
            <path stroke-linecap="round" d="M10 6.5h4M10 17.5h4M6.5 10v4M17.5 10v4" />
          </svg>
          <span class="font-sans font-bold text-base tracking-tight text-text-primary">
            Umlify
          </span>
        </router-link>

        <!-- Center: Desktop Menu Links -->
        <nav class="hidden md:flex items-center gap-md">
          <a
            v-for="link in navLinks"
            :key="link.name"
            :href="link.href"
            class="font-sans text-sm font-medium text-text-secondary hover:text-text-primary transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-interactive-accent rounded px-xxs py-xxs"
          >
            {{ link.name }}
          </a>
        </nav>

        <!-- Right: Desktop Actions -->
        <div class="hidden md:flex items-center gap-sm">
          <router-link to="/login" class="font-sans text-sm font-medium text-text-secondary hover:text-text-primary transition-colors px-xs py-xxs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-interactive-accent rounded">
            Login
          </router-link>
          <Button variant="primary" size="sm" @click="launchWorkspace">
            Launch Editor
          </Button>
        </div>

        <!-- Mobile Menu Toggle Button -->
        <button
          @click="toggleMobileMenu"
          class="md:hidden p-xs text-text-secondary hover:text-text-primary hover:bg-bg-surface rounded transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-interactive-accent"
          aria-label="Toggle navigation menu"
        >
          <svg v-if="!isMobileMenuOpen" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M4 6h16M4 12h16M4 18h16" />
          </svg>
          <svg v-else class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

      </div>
    </Container>

    <!-- Mobile Slide-down Menu Drawer -->
    <transition name="slide-down">
      <div
        v-if="isMobileMenuOpen"
        class="md:hidden absolute top-14 left-0 w-full border-b border-border-default bg-bg-base/95 backdrop-blur-lg overflow-hidden z-dropdown shadow-xl"
      >
        <Container size="2xl">
          <div class="py-md flex flex-col gap-md">
            <!-- Navigation Links -->
            <nav class="flex flex-col gap-xs">
              <a
                v-for="link in navLinks"
                :key="link.name"
                :href="link.href"
                @click="closeMobileMenu"
                class="font-sans text-base font-medium text-text-secondary hover:text-text-primary py-xs border-b border-border-default/50 transition-colors"
              >
                {{ link.name }}
              </a>
            </nav>
            
            <!-- Actions -->
            <div class="flex flex-col gap-xs pt-xs pb-sm">
              <router-link
                to="/login"
                @click="closeMobileMenu"
                class="font-sans text-center text-sm font-medium text-text-secondary hover:text-text-primary py-sm border border-border-default rounded-interactive transition-colors hover:bg-bg-surface"
              >
                Login
              </router-link>
              <Button variant="primary" full @click="launchWorkspaceMobile">
                Launch Editor
              </Button>
            </div>
          </div>
        </Container>
      </div>
    </transition>
  </header>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import Container from './Container.vue'
import Button from '../Button.vue'

import { onMounted, onUnmounted } from 'vue'

const router = useRouter()
const isMobileMenuOpen = ref(false)
const isScrolled = ref(false)
const isMounted = ref(false)

const handleScroll = () => {
  isScrolled.value = window.scrollY > 12
}

onMounted(() => {
  window.addEventListener('scroll', handleScroll)
  requestAnimationFrame(() => {
    setTimeout(() => {
      isMounted.value = true
    }, 50)
  })
})

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
})

const navLinks = [
  { name: 'Features', href: '#features' },
  { name: 'Templates', href: '#templates' },
  { name: 'Docs', href: '#docs' },
  { name: 'Pricing', href: '#pricing' }
]

const toggleMobileMenu = () => {
  isMobileMenuOpen.value = !isMobileMenuOpen.value
}

const closeMobileMenu = () => {
  isMobileMenuOpen.value = false
}

const launchWorkspace = () => {
  router.push('/workspace')
}

const launchWorkspaceMobile = () => {
  closeMobileMenu()
  launchWorkspace()
}
</script>

<style scoped>
.slide-down-enter-active {
  transition: transform 0.25s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.25s cubic-bezier(0.16, 1, 0.3, 1);
}
.slide-down-leave-active {
  transition: transform 0.15s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.15s cubic-bezier(0.16, 1, 0.3, 1);
}
.slide-down-enter-from,
.slide-down-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}
</style>
