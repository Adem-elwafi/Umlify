<template>
  <Section ref="sectionRef" spacing="xl" custom-class="flex flex-col justify-center min-h-[calc(100vh-56px)] pb-lg lg:pb-xl">
    <Container size="2xl">
      <Grid cols="12" colsTablet="12" colsMobile="1" gap="xl" align="center" custom-class="items-stretch">
        
        <!-- Left Column: Content Content -->
        <div class="col-span-12 lg:col-span-5 flex flex-col justify-center">
          <Stack gap="lg" align="start">
            
            <!-- Product Badge -->
            <Badge
              variant="accent"
              class="transition-all duration-350 ease-tactile transform"
              :class="isMounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'"
              style="transition-delay: 100ms;"
            >
              Professional UML Editor
            </Badge>

            <!-- Headline -->
            <h1
              class="text-4xl lg:text-5xl font-bold tracking-tight text-text-primary leading-[1.1] w-full text-left transition-all duration-350 ease-tactile transform"
              :class="isMounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'"
              style="transition-delay: 200ms;"
            >
              The fastest way to design professional UML diagrams.
            </h1>

            <!-- Supporting Paragraph -->
            <p
              class="text-base text-text-secondary leading-relaxed max-w-xl w-full text-left transition-all duration-350 ease-tactile transform"
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
              wrap
              class="w-full justify-start transition-all duration-350 ease-tactile transform"
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

            <!-- Trust Row -->
            <div
              class="pt-md w-full border-t border-border-default/50 text-left transition-all duration-350 ease-tactile transform flex"
              :class="isMounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'"
              style="transition-delay: 500ms;"
            >
              <div class="inline-flex flex-col gap-xs px-md py-sm bg-bg-surface/60 backdrop-blur-md border border-border-default/40 rounded-full shadow-sm max-w-full">
                <span class="text-xxs font-mono uppercase tracking-widest text-text-secondary block">
                  Engineered for speed, compliance, and workflow integration
                </span>
                <div class="flex flex-wrap items-center gap-x-sm gap-y-xxs text-text-secondary text-xs font-semibold">
                  <span>✓ UML 2.5 Compliance</span>
                  <span class="text-border-default/85">•</span>
                  <span>✓ Auto-Layout Snapping</span>
                  <span class="text-border-default/85">•</span>
                  <span>✓ Instant SVG Export</span>
                  <span class="text-border-default/85">•</span>
                  <span>✓ Keyboard Shortcuts</span>
                </div>
              </div>
            </div>
            
          </Stack>
        </div>

        <!-- Right Column: Workspace Editor Preview -->
        <div
          class="col-span-12 lg:col-span-7 flex items-stretch min-h-[300px] md:min-h-[360px] lg:min-h-[400px] xl:min-h-[440px] 2xl:min-h-[460px] transition-all duration-350 ease-tactile transform"
          :class="isMounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'"
          style="transition-delay: 600ms;"
        >
          <Surface
            depth="2"
            radius="lg"
            class="w-full h-full flex flex-col overflow-hidden border border-border-default bg-bg-surface/40 shadow-2xl relative"
          >
            <!-- 1px Animated Border Sweep (GPU accelerated) -->
            <svg class="absolute inset-0 w-full h-full pointer-events-none fill-none z-30" xmlns="http://www.w3.org/2000/svg">
              <rect
                x="0.5"
                y="0.5"
                width="calc(100% - 1px)"
                height="calc(100% - 1px)"
                rx="16"
                pathLength="100"
                class="stroke-transparent"
                :class="{ 'animate-border-sweep': isVisible }"
              />
            </svg>
            <!-- 1. Workspace Top Toolbar -->
            <div class="h-10 border-b border-border-default bg-bg-surface flex items-center justify-between px-md select-none shrink-0">
              <div class="flex items-center gap-xs">
                <!-- Project file label -->
                <span class="w-2.5 h-2.5 rounded-full bg-interactive-accent"></span>
                <span class="text-[10px] font-mono font-medium text-text-muted uppercase tracking-wider">Workspace / SystemModel.uml</span>
              </div>
              <!-- Controls -->
              <div class="flex items-center gap-sm">
                <span class="text-[10px] font-mono text-text-muted bg-bg-elevated px-xs py-xxs border border-border-default rounded">⌘K Actions</span>
              </div>
            </div>

            <!-- 2. Workspace Body (Explorer + Canvas + Inspector) -->
            <div class="flex-1 flex min-h-0 relative bg-bg-base/20">
              
              <!-- Left Sidebar: Persistent Utility Rail & Shape Grid (hidden on mobile) -->
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

                <!-- Miniature Shape Spawner Matrix Grid (2x2) -->
                <div class="w-24 border-r border-border-default bg-bg-surface/60 flex flex-col p-xs text-left">
                  <span class="text-[8px] font-mono uppercase tracking-wider text-text-muted mb-xxs px-xxs">Toolbench</span>
                  <div class="grid grid-cols-2 gap-xs p-xxs">
                    <!-- Actor Icon -->
                    <div class="flex flex-col items-center justify-center p-xxs border border-border-default/50 rounded bg-bg-base/40">
                      <svg class="w-3.5 h-3.5 text-text-muted" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <circle cx="12" cy="5" r="3" />
                        <line x1="12" y1="8" x2="12" y2="14" />
                        <line x1="8" y1="10" x2="16" y2="10" />
                        <line x1="12" y1="14" x2="9" y2="19" />
                        <line x1="12" y1="14" x2="15" y2="19" />
                      </svg>
                      <span class="text-[7px] text-text-muted uppercase font-bold mt-0.5 tracking-tighter">Actor</span>
                    </div>
                    <!-- Use Case Icon -->
                    <div class="flex flex-col items-center justify-center p-xxs border border-border-default/50 rounded bg-bg-base/40">
                      <div class="w-4 h-2.5 rounded-full border border-text-muted border-2" />
                      <span class="text-[7px] text-text-muted uppercase font-bold mt-1 tracking-tighter">Use Case</span>
                    </div>
                    <!-- Package Icon -->
                    <div class="flex flex-col items-center justify-center p-xxs border border-border-default/50 rounded bg-bg-base/40">
                      <div class="flex flex-col items-start scale-75 origin-center">
                        <div class="w-2.5 h-1 border-t border-l border-r border-text-muted rounded-t" />
                        <div class="w-4 h-2.5 border border-text-muted rounded" />
                      </div>
                      <span class="text-[7px] text-text-muted uppercase font-bold tracking-tighter">Package</span>
                    </div>
                    <!-- Note Icon -->
                    <div class="flex flex-col items-center justify-center p-xxs border border-border-default/50 rounded bg-bg-base/40">
                      <div class="relative scale-75 origin-center">
                        <div class="w-4 h-3 bg-text-muted/10 border border-text-muted rounded-sm" />
                      </div>
                      <span class="text-[7px] text-text-muted uppercase font-bold tracking-tighter">Note</span>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Main Canvas area with dot grid and UML diagrams -->
              <div class="flex-1 sheet-grid relative overflow-hidden flex items-center justify-center p-sm">
                <!-- Wrapper scaled down for responsiveness to fit all viewports without clipping -->
                <div class="relative w-[520px] h-[340px] scale-[0.7] xs:scale-[0.8] sm:scale-90 md:scale-95 lg:scale-100 xl:scale-105 2xl:scale-115 origin-center shrink-0">
                  
                  <!-- SVG Connector Paths (UML lines) -->
                  <svg class="absolute inset-0 w-full h-full pointer-events-none overflow-visible z-10" xmlns="http://www.w3.org/2000/svg">
                    <defs>
                      <!-- Generalization (Hollow triangle) -->
                      <marker id="hero-generalization" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                        <path d="M 0 0 L 10 5 L 0 10 z" fill="var(--color-bg-surface)" stroke="#a1a1aa" class="dark:stroke-[#71717a]" stroke-width="1.5" />
                      </marker>
                      <!-- Composition (Filled diamond) -->
                      <marker id="hero-composition" viewBox="0 0 12 10" refX="11" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                        <path d="M 0 5 L 6 0 L 12 5 L 6 10 z" fill="#a1a1aa" class="dark:fill-[#71717a]" stroke="none" />
                      </marker>
                      <!-- Association (Simple arrowhead) -->
                      <marker id="hero-association" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="5" markerHeight="5" orient="auto-start-reverse">
                        <path d="M 0 1.5 L 10 5 L 0 8.5" fill="none" stroke="#a1a1aa" class="dark:stroke-[#71717a]" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                      </marker>
                    </defs>

                    <!-- Lines -->
                    <!-- Customer to Order (Composition) -->
                    <path
                      d="M 90 130 L 90 70"
                      class="stroke-zinc-400 dark:stroke-zinc-500 fill-none stroke-[1.5px] transition-all duration-300"
                      marker-start="url(#hero-composition)"
                    />
                    <!-- OrderController to Order (Association) -->
                    <path
                      d="M 90 220 L 90 190"
                      class="stroke-zinc-400 dark:stroke-zinc-500 fill-none stroke-[1.5px] transition-all duration-300"
                      marker-end="url(#hero-association)"
                    />
                    <!-- PaymentService to Order (Association) -->
                    <path
                      d="M 230 150 L 175 150"
                      class="stroke-zinc-400 dark:stroke-zinc-500 fill-none stroke-[1.5px] transition-all duration-300"
                      marker-end="url(#hero-association)"
                    />
                    <!-- Repository to OrderRepository (Realization - dashed) -->
                    <path
                      d="M 405 220 L 405 160"
                      class="stroke-zinc-400 dark:stroke-zinc-500 fill-none stroke-[1.5px] transition-all duration-300"
                      stroke-dasharray="4 3"
                      marker-end="url(#hero-generalization)"
                    />
                  </svg>

                  <!-- HTML UML Nodes -->
                  
                  <!-- Node 1: Customer Class (Top Left-Center) -->
                  <div class="absolute top-[0px] left-[20px] w-[140px] bg-bg-surface border border-border-default rounded-[4px] shadow-sm flex flex-col font-mono text-[9px] select-none text-left">
                    <div class="px-xs py-xxs text-center font-sans font-semibold border-b border-border-default text-text-primary bg-bg-base/40">
                      Customer
                    </div>
                    <div class="p-xxs flex flex-col text-text-secondary border-b border-border-default leading-tight">
                      <span>- id: String</span>
                      <span>- name: String</span>
                      <span>- email: String</span>
                    </div>
                    <div class="p-xxs flex flex-col text-text-secondary leading-tight">
                      <span>+ getProfile(): Object</span>
                    </div>
                  </div>

                  <!-- Node 2: Order Class (Center Left-Center) -->
                  <div class="absolute top-[100px] left-[35px] w-[110px] bg-bg-surface border border-border-default rounded-[4px] shadow-sm flex flex-col font-mono text-[9px] select-none text-left">
                    <div class="px-xs py-xxs text-center font-sans font-semibold border-b border-border-default text-text-primary bg-bg-base/40">
                      Order
                    </div>
                    <div class="p-xxs flex flex-col text-text-secondary border-b border-border-default leading-tight">
                      <span>- orderId: String</span>
                      <span>- total: Float</span>
                      <span>- status: Enum</span>
                    </div>
                    <div class="p-xxs flex flex-col text-text-secondary leading-tight font-semibold text-interactive-accent">
                      <span>+ calculateTax()</span>
                    </div>
                  </div>

                  <!-- Node 3: OrderController (Bottom Left-Center) -->
                  <div class="absolute top-[220px] left-[25px] w-[130px] bg-bg-surface border border-border-default rounded-[4px] shadow-sm flex flex-col font-mono text-[9px] select-none text-left">
                    <div class="px-xs py-xxs text-center font-sans font-semibold border-b border-border-default text-text-primary bg-bg-base/40">
                      OrderController
                    </div>
                    <div class="p-xxs flex flex-col text-text-secondary leading-tight">
                      <span>+ createOrder(): Void</span>
                      <span>+ cancelOrder(): Void</span>
                    </div>
                  </div>

                  <!-- Node 4: PaymentService (Center Right-Center) -->
                  <div class="absolute top-[115px] left-[230px] w-[110px] bg-bg-surface border border-border-default rounded-[4px] shadow-sm flex flex-col font-mono text-[9px] select-none text-left">
                    <div class="px-xs py-xxs text-center font-sans font-semibold border-b border-border-default text-text-primary bg-bg-base/40">
                      PaymentService
                    </div>
                    <div class="p-xxs flex flex-col text-text-secondary leading-tight">
                      <span>+ process(pay: Float)</span>
                      <span>+ refund(id: String)</span>
                    </div>
                  </div>

                  <!-- Node 5: Repository Interface (Top Right) -->
                  <div class="absolute top-[10px] right-[25px] w-[130px] bg-bg-surface border border-border-default rounded-[4px] shadow-md flex flex-col font-mono text-[9px] select-none text-left">
                    <div class="px-xs py-xxs text-center border-b border-border-default bg-bg-base/40">
                      <span class="text-[8px] text-text-muted block leading-none">«interface»</span>
                      <span class="font-sans font-semibold text-text-primary">Repository</span>
                    </div>
                    <div class="p-xxs flex flex-col text-text-secondary leading-tight">
                      <span>+ save(entity: T)</span>
                      <span>+ findById(id: ID): T</span>
                    </div>
                  </div>

                  <!-- Node 6: OrderRepository (Bottom Right) -->
                  <div class="absolute top-[220px] right-[25px] w-[130px] bg-bg-surface border border-border-default rounded-[4px] shadow-sm flex flex-col font-mono text-[9px] select-none text-left">
                    <div class="px-xs py-xxs text-center font-sans font-semibold border-b border-border-default text-text-primary bg-bg-base/40">
                      OrderRepository
                    </div>
                    <div class="p-xxs flex flex-col text-text-secondary leading-tight">
                      <span>+ save(order: Order)</span>
                      <span>+ findById(id: String)</span>
                    </div>
                  </div>

                </div>
              </div>

              <!-- Right Sidebar: Collapsed AI Dock Rail (hidden on mobile/tablet) -->
              <div class="hidden lg:flex w-10 border-l border-border-default bg-bg-surface/60 flex-col items-center py-4 justify-between shrink-0 select-none text-left">
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
            <div class="h-6 border-t border-border-default bg-bg-surface flex items-center justify-between px-md text-[9px] font-mono text-text-muted select-none shrink-0 animate-fade">
              <div class="flex items-center gap-xs">
                <transition name="fade-compile" mode="out-in">
                  <div v-if="!isCompiled" key="compiling" class="flex items-center gap-xs">
                    <span class="text-warning animate-pulse">●</span>
                    <span>Compiling class structures...</span>
                  </div>
                  <div v-else key="compiled" class="flex items-center gap-xs">
                    <span class="text-success">●</span>
                    <span>Compiled: 6 Classes, 4 Connectors</span>
                  </div>
                </transition>
              </div>
              <div>
                <span>Zoom: 100%</span>
              </div>
            </div>

          </Surface>
        </div>

      </Grid>
    </Container>
  </Section>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import Section from './layout/Section.vue'
import Container from './layout/Container.vue'
import Grid from './layout/Grid.vue'
import Stack from './layout/Stack.vue'
import Surface from './layout/Surface.vue'
import Button from './Button.vue'
import Badge from './Badge.vue'

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
