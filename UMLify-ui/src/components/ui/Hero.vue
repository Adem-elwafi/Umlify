<template>
  <Section id="hero" ref="sectionRef" spacing="xl" custom-class="flex flex-col justify-center min-h-[calc(100vh-56px)] pb-lg lg:pb-xl isolate">
    <!-- Grainient animated background layer (hero only) -->
    <div class="absolute inset-0 -z-10 pointer-events-none">
      <Grainient
        color1="#8b5cf6"
        color2="#6633ee"
        color3="#0b071a"
        :time-speed="0.2"
        :warp-strength="0.8"
        :warp-speed="1.5"
        :warp-amplitude="45"
        :grain-amount="0.08"
        :contrast="1.25"
        :saturation="1.1"
        :zoom="1.0"
      />
    </div>
    <div class="relative z-10 w-full">
    <Container size="2xl">
      <!-- Centered text block: Badge -> Headline -> Paragraph -> CTA -->
      <Stack gap="lg" align="center" class="text-center max-w-2xl mx-auto">
        
        <!-- Product Badge -->
        <Badge
          variant="accent"
          class="backdrop-blur-sm bg-white/15 text-white border border-white/25 dark:bg-white/10 dark:text-white dark:border-white/20 transition-all duration-350 ease-tactile transform"
          :class="isMounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'"
          style="transition-delay: 100ms;"
        >
          Professional UML Editor
        </Badge>

        <!-- Headline -->
        <h1
          class="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight leading-[1.1] w-full text-center text-[#f5f3ff] dark:text-[#f5f3ff] [text-shadow:0_1px_18px_rgba(0,0,0,0.28)] transition-all duration-350 ease-tactile transform"
          :class="isMounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'"
          style="transition-delay: 200ms;"
        >
          The fastest way to design professional UML diagrams.
        </h1>

        <!-- Supporting Paragraph -->
        <p
          class="text-base md:text-lg leading-relaxed max-w-xl w-full text-center text-[#e9e6fb] dark:text-[#e9e6fb] [text-shadow:0_1px_14px_rgba(0,0,0,0.22)] transition-all duration-350 ease-tactile transform"
          :class="isMounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'"
          style="transition-delay: 300ms;"
        >
          Create, edit, and export professional UML diagrams directly in your browser. Umlify combines an intuitive, keyboard-driven workspace with auto-routing layouts to speed up system design.
        </p>

        <!-- CTA Row -->
        <Stack
          direction="row"
          gap="md"
          align="center"
          justify="center"
          wrap
          class="w-full justify-center transition-all duration-350 ease-tactile transform"
          :class="isMounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'"
          style="transition-delay: 400ms;"
        >
          <Button variant="primary" @click="handlePrimaryCTA">
            Launch Editor
          </Button>
          <Button variant="secondary" @click="handleSecondaryCTA">
            Explore Features
          </Button>
        </Stack>
      </Stack>

      <!-- Spacer between text block and preview -->
      <div class="h-12 md:h-16 lg:h-20"></div>

      <!-- Centered Workspace Editor Preview -->
      <div
        class="w-full max-w-4xl mx-auto min-h-[220px] md:min-h-[260px] lg:min-h-[300px] xl:min-h-[340px] 2xl:min-h-[360px] transition-all duration-350 ease-tactile transform"
        :class="isMounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'"
        style="transition-delay: 600ms;"
      >
        <Surface
          depth="2"
          radius="lg"
          class="w-full h-full flex flex-col overflow-hidden border border-border-default bg-bg-surface/20 shadow-2xl relative"
        >
            <!-- Mock Workspace Header (replicates Home.vue) -->
            <div class="h-10 border-b border-bar-border bg-navbar-bg text-zinc-100 flex items-center justify-between px-sm select-none shrink-0">
              <!-- Left Branding -->
              <div class="flex items-center gap-1.5">
                <svg class="w-4 h-4 text-interactive-accent" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <rect x="2" y="3" width="7" height="6" rx="1" />
                  <rect x="15" y="3" width="7" height="6" rx="1" />
                  <rect x="8.5" y="15" width="7" height="6" rx="1" />
                  <path d="M5.5 9v3h3v3" />
                  <path d="M18.5 9v3h-3v3" />
                </svg>
                <span class="text-xs font-bold text-white tracking-tight">UMLify</span>
                <span class="text-[8px] font-semibold bg-white/15 text-white px-1.5 py-0.2 rounded border border-white/10">v0.2.0-alpha</span>
              </div>
              <!-- Center Enterprise Menu -->
              <div class="hidden md:flex items-center gap-3 text-[9px] font-medium text-white/80">
                <span>Workspace Settings</span>
                <div class="w-1 h-1 rounded-full bg-white/30"></div>
                <span>Collaboration Engine</span>
                <div class="w-1 h-1 rounded-full bg-white/30"></div>
                <span>Analytics Profile</span>
              </div>
              <!-- Right Controls -->
              <div class="flex items-center gap-2">
                <span class="text-[8px] font-mono text-white bg-white/15 px-1.5 py-0.5 border border-white/10 rounded">Saved to Cloud</span>
              </div>
            </div>

            <!-- Telemetry / Property Control Strip -->
            <div class="h-8 border-b border-border-default bg-bg-surface/30 flex items-center justify-between px-sm select-none shrink-0 text-[8px]">
              <!-- Left side: Undo/Redo -->
              <div class="flex items-center gap-1 bg-bg-surface border border-border-default rounded px-1 py-0.5">
                <svg class="w-3 h-3 text-text-secondary cursor-pointer" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 7v6h6"/><path d="M21 17a9 9 0 0 0-9-9 9 9 0 0 0-6 2.3L3 13"/></svg>
                <div class="w-px h-2.5 bg-border-default mx-0.5"></div>
                <svg class="w-3 h-3 text-text-secondary cursor-pointer" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 7v6h-6"/><path d="M3 17a9 9 0 0 1 9-9 9 9 0 0 1 6 2.3l3 2.7"/></svg>
              </div>
              <!-- Center: Property controls mock -->
              <div class="flex items-center gap-3 text-text-secondary">
                <div class="flex items-center gap-1">
                  <span class="font-mono text-text-muted font-bold">NAME:</span>
                  <span class="bg-bg-surface border border-border-default px-1 py-0.2 rounded font-medium">Checkout</span>
                </div>
                <div class="flex items-center gap-1.5">
                  <span class="font-mono text-text-muted font-bold">X:</span>
                  <span class="bg-bg-surface border border-border-default px-1 py-0.2 rounded font-mono">480</span>
                </div>
                <div class="flex items-center gap-1.5">
                  <span class="font-mono text-text-muted font-bold">Y:</span>
                  <span class="bg-bg-surface border border-border-default px-1 py-0.2 rounded font-mono">400</span>
                </div>
              </div>
            </div>
                <!-- 2. Workspace Body -->
            <div class="flex-1 flex min-h-0 relative bg-bg-base/20">

              <!-- Left Sidebar: Collapsed State (show utility rail only) -->
              <div class="hidden sm:flex shrink-0 select-none">
                <!-- Miniature Persistent Utility Rail -->
                <div class="w-8 h-full bg-bg-surface/40 border-r border-border-default flex flex-col items-center py-2 justify-between shrink-0">
                  <div class="flex flex-col items-center gap-2">
                    <div class="p-1 rounded bg-bg-elevated border border-border-elevated text-text-primary">
                      <!-- Folder Icon -->
                      <svg class="w-3.5 h-3.5 text-text-secondary" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/></svg>
                    </div>
                    <div class="p-1 text-text-muted hover:text-text-primary">
                      <!-- Save Icon -->
                      <svg class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/><polyline points="17 21 17 13 7 13 7 21"/><polyline points="7 3 7 8 15 8"/></svg>
                    </div>
                  </div>
                  <div class="p-1 text-success">
                    <!-- Cloud Icon -->
                    <svg class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 10h-1.26A8 8 0 1 0 9 20h9a5 5 0 0 0 0-10z"/></svg>
                  </div>
                </div>
              </div>

              <!-- Main Canvas area with dot grid and UML diagrams -->
              <div class="flex-grow sheet-grid relative overflow-hidden flex items-center justify-center p-sm">
                <!-- Wrapper scaled down for responsiveness to fit all viewports without clipping -->
                <div class="relative w-[800px] h-[480px] scale-[0.38] xs:scale-[0.42] sm:scale-[0.5] md:scale-[0.56] lg:scale-[0.62] xl:scale-[0.72] 2xl:scale-[0.82] origin-center shrink-0">
                  
                  <!-- Real Connector lines -->
                  <Connector
                    v-for="c in connectionsList"
                    :key="c.id"
                    :id="c.id"
                    :from="getConnectionPoint(getElement(c.from), c.fromSide)"
                    :to="getConnectionPoint(getElement(c.to), c.toSide)"
                    :fromElement="getElement(c.from)"
                    :toElement="getElement(c.to)"
                    :type="c.type"
                  />

                  <!-- Render Elements -->
                  <template v-for="el in elements" :key="el.id">
                    <div
                      v-if="el.type === 'system'"
                      class="absolute border-2 border-border-default/60 bg-bg-surface/10 rounded flex flex-col items-center p-xs shadow-sm"
                      :style="{
                        left: el.x + 'px',
                        top: el.y + 'px',
                        width: el.width + 'px',
                        height: el.height + 'px'
                      }"
                    >
                      <span class="text-[10px] font-bold text-text-muted uppercase tracking-widest mt-2">{{ el.label }}</span>
                    </div>

                    <div 
                      v-else-if="el.type === 'actor'"
                      class="absolute select-none"
                      :style="{
                        left: el.x + 'px',
                        top: el.y + 'px',
                        width: el.width + 'px',
                        height: el.height + 'px'
                      }"
                    >
                      <Actor :label="el.label" />
                    </div>

                    <div 
                      v-else-if="el.type === 'usecase'"
                      class="absolute select-none"
                      :style="{
                        left: el.x + 'px',
                        top: el.y + 'px',
                        width: el.width + 'px',
                        height: el.height + 'px'
                      }"
                    >
                      <UseCase :label="el.label" />
                    </div>
                  </template>

                </div>
              </div>

              <!-- Right Sidebar: Collapsed AI Dock Rail (hidden on mobile/tablet) -->
              <div class="hidden lg:flex w-10 border-l border-border-default bg-bg-surface flex-col items-center py-4 justify-between shrink-0 select-none text-left">
                <!-- Upper toggle chevron button -->
                <div class="p-1 rounded text-text-secondary hover:bg-bg-elevated cursor-pointer">
                  <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="15 18 9 12 15 6"/></svg>
                </div>
                <!-- Rotated Text Label -->
                <div 
                  class="text-[8px] font-bold uppercase tracking-widest text-text-muted font-mono whitespace-nowrap"
                  style="writing-mode: vertical-rl; transform: rotate(180deg);"
                >
                  AI Compiler
                </div>
                <!-- Pulse Status Indicator -->
                <div class="flex items-center justify-center">
                  <span class="w-1.5 h-1.5 rounded-full bg-success"></span>
                </div>
              </div>

            </div>

            <!-- 3. Bottom Status Bar -->
            <div class="h-6 border-t border-bar-border bg-statusbar-bg flex items-center justify-between px-md text-[9px] font-mono text-zinc-400 select-none shrink-0 animate-fade">
              <div class="flex items-center gap-xs">
                <transition name="fade-compile" mode="out-in">
                  <div v-if="!isCompiled" key="compiling" class="flex items-center gap-xs">
                    <span class="text-warning animate-pulse">●</span>
                    <span>Compiling Use Cases...</span>
                  </div>
                  <div v-else key="compiled" class="flex items-center gap-xs">
                    <span class="text-success">●</span>
                    <span>Compiled: 2 Actors, 3 Use Cases, 5 Connectors</span>
                  </div>
                </transition>
              </div>
              <div>
                <span>Zoom: 100%</span>
              </div>
            </div>

          </Surface>
      </div>
    </Container>
    </div>
  </Section>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import Section from './layout/Section.vue'
import Container from './layout/Container.vue'
import Stack from './layout/Stack.vue'
import Surface from './layout/Surface.vue'
import Button from './Button.vue'
import Badge from './Badge.vue'
import Grainient from '../Grainient.vue'

import Actor from '../Actor.vue'
import UseCase from '../UseCase.vue'
import Connector from '../connector.vue'
import { getConnectionPoint } from '../../utils/connectorRouting'

const elements = [
  // System Boundary
  { id: 'app-boundary', type: 'system', label: 'local legends App', x: 220, y: 40, width: 360, height: 380 },

  // Actors (External/Internal)
  { id: 'consumer', type: 'actor', label: 'Content Consumer', x: 60, y: 170, width: 80, height: 120 },
  { id: 'mongodb', type: 'actor', label: 'MongoDB Atlas', x: 660, y: 170, width: 80, height: 120 },

  // Use Cases (Functional)
  { id: 'geolocate', type: 'usecase', label: 'GeoLocate User', x: 310, y: 80, width: 180, height: 60 },
  { id: 'read-story', type: 'usecase', label: 'Read A Story', x: 310, y: 200, width: 180, height: 60 },
  { id: 'query-data', type: 'usecase', label: 'Query Story Data', x: 310, y: 320, width: 180, height: 60 }
]

const connectionsList = [
  // 3 Associations (Actors to Use Cases)
  { id: 'conn-1', from: 'consumer', to: 'geolocate', fromSide: 'right', toSide: 'left', type: 'association' },
  { id: 'conn-2', from: 'consumer', to: 'read-story', fromSide: 'right', toSide: 'left', type: 'association' },
  { id: 'conn-3', from: 'mongodb', to: 'query-data', fromSide: 'left', toSide: 'right', type: 'association' },

  // 2 Includes
  { id: 'conn-4', from: 'read-story', to: 'geolocate', fromSide: 'top', toSide: 'bottom', type: 'include' },
  { id: 'conn-5', from: 'read-story', to: 'query-data', fromSide: 'bottom', toSide: 'top', type: 'include' }
]

const getElement = (id) => elements.find(e => e.id === id)

const router = useRouter()
const isMounted = ref(false)
const isCompiled = ref(false)
const isVisible = ref(false)
const sectionRef = ref(null)

const handlePrimaryCTA = () => {
  router.push('/workspace')
}

const handleSecondaryCTA = () => {
  const el = document.getElementById('features')
  if (el) {
    el.scrollIntoView({ behavior: 'smooth' })
  }
}

onMounted(() => {
  requestAnimationFrame(() => {
    setTimeout(() => {
      isMounted.value = true
    }, 50)
  })

  setTimeout(() => {
    isCompiled.value = true
  }, 1400)

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
      threshold: 0.1
    }
  )

  const el = sectionRef.value?.$el || sectionRef.value
  if (el) {
    observer.observe(el)
  }
})
</script>

<style scoped>
@keyframes blink {
  0%, 100% { opacity: 0; }
  50% { opacity: 1; }
}

.cursor-blink {
  animation: blink 1s step-end infinite;
}

.fade-compile-enter-active,
.fade-compile-leave-active {
  transition: opacity 0.15s ease;
}
.fade-compile-enter-from,
.fade-compile-leave-to {
  opacity: 0;
}

@media (prefers-reduced-motion: reduce) {
  .transition-all,
  .animate-pulse,
  .cursor-blink {
    transition: none !important;
    animation: none !important;
    transform: none !important;
    opacity: 1 !important;
  }
}
</style>
