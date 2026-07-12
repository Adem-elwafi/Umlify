<template>
  <div class="w-full">
    <!-- Desktop Layout (Surrounding elements with SVG connector lines) -->
    <div
      ref="containerRef"
      class="relative w-full max-w-[850px] mx-auto aspect-[85/42] hidden lg:block select-none"
    >
      <!-- Background SVG Connector Lines -->
      <svg
        viewBox="0 0 850 420"
        width="100%"
        height="100%"
        preserveAspectRatio="none"
        class="absolute inset-0 w-full h-full pointer-events-none overflow-visible z-10"
      >
        <!-- Connector Line Definitions -->
        <!-- Left Cards -->
        <path
          d="M 280 155 L 221 75"
          fill="none"
          class="transition-all duration-300"
          :class="[
            isVisible ? 'animate-draw-line' : 'opacity-0 stroke-transparent',
            activeCard === 'svg'
              ? 'stroke-interactive-accent stroke-[2.5px]'
              : 'stroke-zinc-400 dark:stroke-zinc-500 stroke-[1.5px]'
          ]"
          style="animation-delay: 100ms;"
        />
        <path
          d="M 280 210 L 221 210"
          fill="none"
          class="transition-all duration-300"
          :class="[
            isVisible ? 'animate-draw-line' : 'opacity-0 stroke-transparent',
            activeCard === 'png'
              ? 'stroke-interactive-accent stroke-[2.5px]'
              : 'stroke-zinc-400 dark:stroke-zinc-500 stroke-[1.5px]'
          ]"
          style="animation-delay: 200ms;"
        />
        <path
          d="M 280 265 L 221 345"
          fill="none"
          class="transition-all duration-300"
          :class="[
            isVisible ? 'animate-draw-line' : 'opacity-0 stroke-transparent',
            activeCard === 'pdf'
              ? 'stroke-interactive-accent stroke-[2.5px]'
              : 'stroke-zinc-400 dark:stroke-zinc-500 stroke-[1.5px]'
          ]"
          style="animation-delay: 300ms;"
        />

        <!-- Right Cards -->
        <path
          d="M 570 155 L 629 75"
          fill="none"
          class="transition-all duration-300"
          :class="[
            isVisible ? 'animate-draw-line' : 'opacity-0 stroke-transparent',
            activeCard === 'plantuml'
              ? 'stroke-interactive-accent stroke-[2.5px]'
              : 'stroke-zinc-400 dark:stroke-zinc-500 stroke-[1.5px]'
          ]"
          style="animation-delay: 400ms;"
        />
        <path
          d="M 570 210 L 629 210"
          fill="none"
          class="transition-all duration-300"
          :class="[
            isVisible ? 'animate-draw-line' : 'opacity-0 stroke-transparent',
            activeCard === 'mermaid'
              ? 'stroke-interactive-accent stroke-[2.5px]'
              : 'stroke-zinc-400 dark:stroke-zinc-500 stroke-[1.5px]'
          ]"
          style="animation-delay: 500ms;"
        />
        <path
          d="M 570 265 L 629 345"
          fill="none"
          class="transition-all duration-300"
          :class="[
            isVisible ? 'animate-draw-line' : 'opacity-0 stroke-transparent',
            activeCard === 'json'
              ? 'stroke-interactive-accent stroke-[2.5px]'
              : 'stroke-zinc-400 dark:stroke-zinc-500 stroke-[1.5px]'
          ]"
          style="animation-delay: 600ms;"
        />
      </svg>

      <!-- Center Node: UML Workspace Preview -->
      <Surface
        depth="2"
        radius="md"
        class="absolute left-[33%] top-[25%] w-[34%] h-[50%] z-20 flex flex-col overflow-hidden border border-border-default bg-bg-surface/40 shadow-2xl transition-all duration-500 transform"
        :class="isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-95'"
        style="transition-delay: 50ms;"
      >
        <!-- Workspace Header -->
        <div class="h-6 border-b border-border-default bg-bg-surface flex items-center justify-between px-xs select-none shrink-0 text-[8px] font-mono text-text-muted">
          <div class="flex items-center gap-xxs">
            <span class="w-1.5 h-1.5 rounded-full bg-interactive-accent"></span>
            <span>Workspace / SystemModel.uml</span>
          </div>
          <span>100%</span>
        </div>
        <!-- Workspace Body -->
        <div class="flex-1 sheet-grid relative flex items-center justify-center p-xs overflow-hidden">
          <div class="relative w-[130px] h-[70px] flex items-center justify-center gap-xs">
            <svg class="absolute inset-0 w-full h-full pointer-events-none overflow-visible z-10" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <marker id="export-center-assoc" viewBox="0 0 10 10" refX="10" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                  <path
                    d="M 0 1.5 L 10 5 L 0 8.5"
                    fill="none"
                    stroke="#a1a1aa"
                    class="dark:stroke-[#71717a]"
                    stroke-width="1.5"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                </marker>
              </defs>
              <path
                d="M 45 35 L 85 35"
                class="stroke-zinc-400 dark:stroke-zinc-500 fill-none stroke-[1.2px]"
                marker-end="url(#export-center-assoc)"
              />
            </svg>
            <!-- Class 1 -->
            <div class="w-12 h-10 border border-border-default bg-bg-base rounded p-0.5 flex flex-col justify-between z-10 text-[5px] text-left">
              <span class="font-bold border-b border-border-default/50 text-[6px] pb-px">User</span>
              <span class="font-mono text-text-secondary text-[4.5px]">+ name</span>
            </div>
            <!-- Class 2 -->
            <div class="w-12 h-10 border border-border-default bg-bg-base rounded p-0.5 flex flex-col justify-between z-10 text-[5px] text-left">
              <span class="font-bold border-b border-border-default/50 text-[6px] pb-px">Order</span>
              <span class="font-mono text-text-secondary text-[4.5px]">+ date</span>
            </div>
          </div>
        </div>
      </Surface>

      <!-- Left Side Export Cards Column -->
      <div
        class="absolute left-[4%] top-[3%] bottom-[3%] w-[22%] z-20 flex flex-col justify-between h-[94%]"
      >
        <div
          v-for="(t, index) in leftTargets"
          :key="t.id"
          class="w-full transition-all duration-500 transform"
          :class="isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-4'"
          :style="{ transitionDelay: `${250 + (index * 100)}ms` }"
          @mouseenter="activeCard = t.id"
          @mouseleave="activeCard = null"
        >
          <Card
            hoverable
            custom-class="group p-xs text-left transition-all duration-300 focus-visible:ring-2 focus-visible:ring-interactive-accent focus-visible:outline-none hover:border-interactive-accent/50 bg-gradient-to-b from-bg-surface to-bg-surface/30 cursor-pointer"
            tabindex="0"
            :aria-label="`Export target: ${t.title}. ${t.description}`"
          >
            <Stack gap="xs" align="start">
              <div class="flex items-center gap-xs">
                <div class="p-xxs rounded bg-bg-surface border border-border-default text-text-secondary group-hover:text-interactive-accent transition-colors duration-300">
                  <component :is="t.icon" class="w-4 h-4" />
                </div>
                <h4 class="text-xs font-semibold text-text-primary group-hover:text-interactive-accent transition-colors duration-300">
                  {{ t.title }}
                </h4>
              </div>
              <p class="text-[10px] text-text-secondary leading-relaxed">
                {{ t.description }}
              </p>
            </Stack>
          </Card>
        </div>
      </div>

      <!-- Right Side Export Cards Column -->
      <div
        class="absolute right-[4%] top-[3%] bottom-[3%] w-[22%] z-20 flex flex-col justify-between h-[94%]"
      >
        <div
          v-for="(t, index) in rightTargets"
          :key="t.id"
          class="w-full transition-all duration-500 transform"
          :class="isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-4'"
          :style="{ transitionDelay: `${250 + ((index + 3) * 100)}ms` }"
          @mouseenter="activeCard = t.id"
          @mouseleave="activeCard = null"
        >
          <Card
            hoverable
            custom-class="group p-xs text-left transition-all duration-300 focus-visible:ring-2 focus-visible:ring-interactive-accent focus-visible:outline-none hover:border-interactive-accent/50 bg-gradient-to-b from-bg-surface to-bg-surface/30 cursor-pointer"
            tabindex="0"
            :aria-label="`Export target: ${t.title}. ${t.description}`"
          >
            <Stack gap="xs" align="start">
              <div class="flex items-center gap-xs">
                <div class="p-xxs rounded bg-bg-surface border border-border-default text-text-secondary group-hover:text-interactive-accent transition-colors duration-300">
                  <component :is="t.icon" class="w-4 h-4" />
                </div>
                <h4 class="text-xs font-semibold text-text-primary group-hover:text-interactive-accent transition-colors duration-300">
                  {{ t.title }}
                </h4>
              </div>
              <p class="text-[10px] text-text-secondary leading-relaxed">
                {{ t.description }}
              </p>
            </Stack>
          </Card>
        </div>
      </div>
    </div>

    <!-- Tablet/Mobile Layout (Stacked Workspace followed by Cards Grid) -->
    <div class="lg:hidden flex flex-col gap-lg w-full max-w-[500px] mx-auto select-none">
      <!-- Workspace Node (Top) -->
      <div
        class="w-full h-[150px] transition-all duration-500 transform"
        :class="isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'"
      >
        <Surface
          depth="2"
          radius="md"
          class="w-full h-full flex flex-col overflow-hidden border border-border-default bg-bg-surface/40 shadow-xl"
        >
          <div class="h-6 border-b border-border-default bg-bg-surface flex items-center justify-between px-xs select-none shrink-0 text-[8px] font-mono text-text-muted">
            <div class="flex items-center gap-xxs">
              <span class="w-1.5 h-1.5 rounded-full bg-interactive-accent"></span>
              <span>Workspace / SystemModel.uml</span>
            </div>
            <span>100%</span>
          </div>
          <div class="flex-1 sheet-grid relative flex items-center justify-center p-xs overflow-hidden">
            <div class="relative w-[130px] h-[70px] flex items-center justify-center gap-xs">
              <svg class="absolute inset-0 w-full h-full pointer-events-none" xmlns="http://www.w3.org/2000/svg">
                <line x1="45" y1="35" x2="85" y2="35" class="stroke-text-secondary" stroke-width="1.2" />
                <path d="M 85 35 L 80 31 M 85 35 L 80 39" fill="none" class="stroke-text-secondary" stroke-width="1.2" />
              </svg>
              <!-- Class 1 -->
              <div class="w-12 h-10 border border-border-default bg-bg-base rounded p-0.5 flex flex-col justify-between z-10 text-[5px] text-left">
                <span class="font-bold border-b border-border-default/50 text-[6px] pb-px">User</span>
                <span class="font-mono text-text-secondary text-[4.5px]">+ name</span>
              </div>
              <!-- Class 2 -->
              <div class="w-12 h-10 border border-border-default bg-bg-base rounded p-0.5 flex flex-col justify-between z-10 text-[5px] text-left">
                <span class="font-bold border-b border-border-default/50 text-[6px] pb-px">Order</span>
                <span class="font-mono text-text-secondary text-[4.5px]">+ date</span>
              </div>
            </div>
          </div>
        </Surface>
      </div>

      <!-- Targets Grid (Bottom) -->
      <Grid
        cols="2"
        cols-tablet="2"
        cols-mobile="1"
        gap="md"
        class="w-full"
      >
        <div
          v-for="(t, index) in targets"
          :key="t.id"
          class="transition-all duration-500 transform"
          :class="isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'"
          :style="{ transitionDelay: `${150 + (index * 50)}ms` }"
        >
          <Card
            hoverable
            custom-class="group p-xs text-left transition-all duration-300 focus-visible:ring-2 focus-visible:ring-interactive-accent focus-visible:outline-none hover:border-interactive-accent/50 bg-gradient-to-b from-bg-surface to-bg-surface/30 cursor-pointer"
            tabindex="0"
            :aria-label="`Export target: ${t.title}. ${t.description}`"
          >
            <Stack gap="xs" align="start">
              <div class="flex items-center gap-xs">
                <div class="p-xxs rounded bg-bg-surface border border-border-default text-text-secondary group-hover:text-interactive-accent transition-colors duration-300">
                  <component :is="t.icon" class="w-4 h-4" />
                </div>
                <h4 class="text-xs font-semibold text-text-primary group-hover:text-interactive-accent transition-colors duration-300">
                  {{ t.title }}
                </h4>
              </div>
              <p class="text-[10px] text-text-secondary leading-relaxed">
                {{ t.description }}
              </p>
            </Stack>
          </Card>
        </div>
      </Grid>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import {
  FileCode,
  FileImage,
  FileText,
  Code,
  Workflow,
  FileJson
} from 'lucide-vue-next'

import Surface from '../ui/layout/Surface.vue'
import Card from '../ui/Card.vue'
import Stack from '../ui/layout/Stack.vue'
import Grid from '../ui/layout/Grid.vue'

const containerRef = ref(null)
const isVisible = ref(false)
const activeCard = ref(null)

const targets = [
  {
    id: 'svg',
    title: 'SVG Vector',
    description: 'Scalable vector file ideal for documents and web wikis.',
    icon: FileCode,
    side: 'left',
    topClass: 'top-[10%]'
  },
  {
    id: 'png',
    title: 'PNG Image',
    description: 'High-resolution image file for slides and presentations.',
    icon: FileImage,
    side: 'left',
    topClass: 'top-[40%]'
  },
  {
    id: 'pdf',
    title: 'PDF Document',
    description: 'Standard print-ready document format for reports.',
    icon: FileText,
    side: 'left',
    topClass: 'top-[70%]'
  },
  {
    id: 'plantuml',
    title: 'PlantUML',
    description: 'Export source code compatible with PlantUML engines.',
    icon: Code,
    side: 'right',
    topClass: 'top-[10%]'
  },
  {
    id: 'mermaid',
    title: 'Mermaid.js',
    description: 'Markdown-compatible code block format for GitHub wikis.',
    icon: Workflow,
    side: 'right',
    topClass: 'top-[40%]'
  },
  {
    id: 'json',
    title: 'JSON Project',
    description: 'Complete project configuration code for offline backup.',
    icon: FileJson,
    side: 'right',
    topClass: 'top-[70%]'
  }
]

const leftTargets = computed(() => targets.filter(t => t.side === 'left'))
const rightTargets = computed(() => targets.filter(t => t.side === 'right'))

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

  const el = containerRef.value || containerRef.value?.$el
  if (el) {
    observer.observe(el)
  } else {
    // Fallback if desktop ref not active immediately
    const fallbackEl = document.getElementById('capabilities')
    if (fallbackEl) {
      observer.observe(fallbackEl.parentElement)
    } else {
      isVisible.value = true
    }
  }
})
</script>

<style scoped>
@keyframes drawLine {
  from {
    stroke-dashoffset: 400;
  }
  to {
    stroke-dashoffset: 0;
  }
}

.animate-draw-line {
  stroke-dasharray: 400;
  stroke-dashoffset: 400;
  animation: drawLine 1.5s ease-out forwards;
}

@media (prefers-reduced-motion: reduce) {
  .animate-draw-line {
    animation: none !important;
    stroke-dashoffset: 0 !important;
    stroke-dasharray: none !important;
  }
  .transform,
  .transition-all {
    transition: none !important;
    transform: none !important;
    animation: none !important;
    opacity: 1 !important;
  }
}
</style>
