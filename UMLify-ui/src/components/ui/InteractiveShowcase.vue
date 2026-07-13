<template>
  <Section ref="sectionRef" id="features" spacing="xxl" custom-class="border-t border-border-default bg-bg-base/30 relative overflow-hidden">
    <Container size="xl">
      <Stack gap="xl">
        
        <!-- Section Header -->
        <Stack gap="sm" align="start" class="max-w-2xl text-left">
          <Badge variant="accent">Guided Tour</Badge>
          <h2 class="text-3xl lg:text-4xl font-bold tracking-tight text-text-primary w-full">
            How Umlify works.
          </h2>
          <p class="text-sm text-text-secondary leading-relaxed w-full">
            See how Umlify accelerates your technical system design flow from initial entity definition to final documentation asset creation.
          </p>
        </Stack>

        <!-- Main Showcase Grid -->
        <Grid cols="12" colsTablet="12" colsMobile="1" gap="xl" align="center" custom-class="items-stretch">
          
          <!-- Left Column: Workflow Navigation Steps -->
          <div class="col-span-12 lg:col-span-5 flex flex-col justify-center">
            <div 
              class="flex flex-col gap-sm"
              role="tablist"
              aria-label="Umlify Workflow Steps"
              @keydown.up.prevent="selectPrev"
              @keydown.down.prevent="selectNext"
              @keydown.left.prevent="selectPrev"
              @keydown.right.prevent="selectNext"
            >
              <div
                v-for="(step, index) in steps"
                :key="step.id"
                ref="stepRefs"
                role="tab"
                :aria-selected="activeStep === step.id"
                :aria-controls="'showcase-panel-' + step.id"
                :tabindex="activeStep === step.id ? 0 : -1"
                class="group text-left p-md border rounded-card transition-all duration-350 ease-tactile cursor-pointer select-none outline-none focus-visible:ring-2 focus-visible:ring-interactive-accent relative overflow-hidden"
                :class="[
                  activeStep === step.id
                    ? 'bg-bg-surface border-border-elevated shadow-sm'
                    : 'bg-transparent border-transparent hover:bg-bg-surface/30'
                ]"
                @click="setActiveStep(step.id)"
                @mouseenter="pauseRotation"
                @mouseleave="resumeRotation"
              >
                <!-- 1px Animated Border Sweep (GPU accelerated) -->
                <svg class="absolute inset-0 w-full h-full pointer-events-none fill-none z-30" xmlns="http://www.w3.org/2000/svg">
                  <rect
                    x="0.5"
                    y="0.5"
                    width="calc(100% - 1px)"
                    height="calc(100% - 1px)"
                    rx="12"
                    pathLength="100"
                    class="stroke-transparent"
                    :class="{ 'animate-border-sweep': isVisible }"
                  />
                </svg>
                <div class="flex gap-md relative z-10">
                  <!-- Active Indicator / Step Number -->
                  <div class="flex flex-col items-center">
                    <span 
                      class="text-xs font-mono font-bold transition-colors duration-350"
                      :class="activeStep === step.id ? 'text-interactive-accent' : 'text-text-muted group-hover:text-text-secondary'"
                    >
                      {{ step.num }}
                    </span>
                    <div 
                      class="w-[1.5px] mt-xs flex-1 transition-colors duration-350"
                      :class="activeStep === step.id ? 'bg-interactive-accent' : 'bg-transparent'"
                    ></div>
                  </div>

                  <!-- Text Block -->
                  <Stack gap="xxs">
                    <h3 
                      class="text-sm font-semibold transition-colors duration-350"
                      :class="activeStep === step.id ? 'text-text-primary' : 'text-text-secondary group-hover:text-text-primary'"
                    >
                      {{ step.title }}
                    </h3>
                    <p class="text-xs text-text-secondary leading-relaxed">
                      {{ step.sentence }}
                    </p>
                  </Stack>
                </div>
              </div>
            </div>
          </div>

          <!-- Right Column: Simulative Live Workspace Preview -->
          <div 
            class="col-span-12 lg:col-span-7 flex items-stretch min-h-[300px] md:min-h-[360px] lg:min-h-[400px] xl:min-h-[440px] 2xl:min-h-[460px]"
            @mouseenter="pauseRotation"
            @mouseleave="resumeRotation"
          >
            <Surface
              depth="2"
              radius="lg"
              class="w-full h-full flex flex-col overflow-hidden border border-border-default bg-bg-surface/40 shadow-2xl relative"
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
              </div>              <!-- 2. Workspace Body -->
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

                <!-- Center Canvas (Dynamic rendering dependent on activeStep) -->
                <div 
                  class="flex-1 sheet-grid relative overflow-hidden flex items-center justify-center p-sm"
                  :id="'showcase-panel-' + activeStep"
                  role="tabpanel"
                >
                  <transition name="fade-workspace" mode="out-in">
                    <!-- Wrapper scaled down for responsiveness -->
                    <div 
                      :key="activeStep"
                      class="relative w-[800px] h-[480px] scale-[0.36] xs:scale-[0.4] sm:scale-[0.46] md:scale-[0.52] lg:scale-[0.58] xl:scale-[0.68] 2xl:scale-[0.78] origin-center shrink-0 transition-transform duration-350"
                    >
                      <div :class="{ 'blur-[2px] opacity-40': activeStep === 4 }" class="absolute inset-0">
                        
                        <!-- Render Connectors -->
                        <Connector
                          v-for="c in activeConnections"
                          :key="c.id"
                          :id="c.id"
                          :from="getConnectionPoint(getElement(c.from), c.fromSide)"
                          :to="getConnectionPoint(getElement(c.to), c.toSide)"
                          :fromElement="getElement(c.from)"
                          :toElement="getElement(c.to)"
                          :type="c.type"
                        />

                        <!-- Render Elements -->
                        <template v-for="el in activeElements" :key="el.id">
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
                            <UseCase :label="el.label" :selected="activeStep === 1 && el.id === 'read-story'" />
                            
                            <template v-if="activeStep === 1 && el.id === 'read-story'">
                              <div class="absolute -top-1 -left-1 w-2.5 h-2.5 rounded-full bg-interactive-accent border border-bg-surface z-30"></div>
                              <div class="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-interactive-accent border border-bg-surface z-30"></div>
                              <div class="absolute -bottom-1 -left-1 w-2.5 h-2.5 rounded-full bg-interactive-accent border border-bg-surface z-30"></div>
                              <div class="absolute -bottom-1 -right-1 w-2.5 h-2.5 rounded-full bg-interactive-accent border border-bg-surface z-30"></div>
                            </template>
                          </div>
                        </template>

                        <!-- Sockets pulse overlay for Step 2 -->
                        <template v-if="activeStep === 2">
                          <div 
                            class="absolute select-none pointer-events-none z-30"
                            :style="{
                              left: (customerEl.x + customerEl.width - 4) + 'px',
                              top: (customerEl.y + customerEl.height / 2 - 5) + 'px',
                              width: '10px',
                              height: '10px'
                            }"
                          >
                            <div class="w-2.5 h-2.5 rounded-full bg-interactive-accent ring-4 ring-interactive-accent/30 animate-pulse"></div>
                          </div>
                          <div 
                            class="absolute select-none pointer-events-none z-30"
                            :style="{
                              left: (readStoryEl.x - 6) + 'px',
                              top: (readStoryEl.y + readStoryEl.height / 2 - 5) + 'px',
                              width: '10px',
                              height: '10px'
                            }"
                          >
                            <div class="w-2.5 h-2.5 rounded-full bg-interactive-accent ring-4 ring-interactive-accent/30"></div>
                          </div>
                        </template>

                      </div>

                      <!-- Export Modal Overlay for Step 4 -->
                      <template v-if="activeStep === 4">
                        <div class="absolute inset-0 flex items-center justify-center p-md z-40">
                          <Surface 
                            depth="3" 
                            radius="panel" 
                            class="w-[280px] p-md border border-border-elevated bg-bg-surface shadow-2xl flex flex-col gap-sm relative"
                          >
                            <div class="flex items-center justify-between border-b border-border-default/60 pb-xs">
                              <span class="text-xs font-semibold text-text-primary">Export Diagram</span>
                              <span class="text-[9px] font-mono text-text-muted">v2.5 Spec</span>
                            </div>
                            
                            <Stack gap="xs" class="w-full">
                              <div class="flex items-center justify-between p-xs bg-bg-elevated/40 rounded border border-border-default text-left cursor-pointer hover:border-interactive-accent transition-colors">
                                <span class="text-xs font-medium text-text-primary">Vector Asset (.svg)</span>
                                <Badge variant="accent">Sharp</Badge>
                              </div>
                              <div class="flex items-center justify-between p-xs bg-bg-elevated/40 rounded border border-border-default text-left cursor-pointer hover:border-interactive-accent transition-colors">
                                <span class="text-xs font-medium text-text-primary">High-Res Image (.png)</span>
                                <Badge variant="neutral">300 DPI</Badge>
                              </div>
                              <div class="flex items-center justify-between p-xs bg-bg-elevated/40 rounded border border-border-default text-left cursor-pointer hover:border-interactive-accent transition-colors">
                                <span class="text-xs font-medium text-text-primary">Markdown Embed Code</span>
                                <Badge variant="neutral">Embed</Badge>
                              </div>
                            </Stack>

                            <Button variant="primary" size="sm" class="w-full flex justify-center gap-xs">
                              <span>Copy Embed Code</span>
                            </Button>
                          </Surface>
                        </div>
                      </template>

                    </div>
                  </transition>
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
              <div class="h-6 border-t border-bar-border bg-statusbar-bg flex items-center justify-between px-md text-[9px] font-mono text-zinc-400 select-none shrink-0">
                <div class="flex items-center gap-xs">
                  <span class="text-success">●</span>
                  <span>
                    {{ activeStep === 1 ? 'Workspace initialized' : activeStep === 2 ? 'Active connector selected' : activeStep === 3 ? 'Autolayout complete' : 'Ready to export' }}
                  </span>
                </div>
                <div>
                  <span>Zoom: 100%</span>
                </div>
              </div>

            </Surface>
          </div>

        </Grid>
      </Stack>
    </Container>
  </Section>
</template>

<script setup>
import { ref, onMounted, onUnmounted, nextTick, computed } from 'vue'
import Section from './layout/Section.vue'
import Container from './layout/Container.vue'
import Grid from './layout/Grid.vue'
import Stack from './layout/Stack.vue'
import Surface from './layout/Surface.vue'
import Button from './Button.vue'
import Badge from './Badge.vue'

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
const customerEl = getElement('consumer')
const readStoryEl = getElement('read-story')

const activeElements = computed(() => {
  if (activeStep.value === 1) {
    return elements.filter(e => e.type === 'usecase' || e.type === 'system')
  }
  if (activeStep.value === 2) {
    return elements.filter(e => e.type === 'usecase' || e.type === 'system' || e.id === 'consumer')
  }
  return elements
})

const activeConnections = computed(() => {
  if (activeStep.value === 1) {
    return []
  }
  if (activeStep.value === 2) {
    return [
      { id: 'conn-2', from: 'consumer', to: 'read-story', fromSide: 'right', toSide: 'left', type: 'dependency' }
    ]
  }
  return connectionsList
})

const activeStep = ref(1)
const rotationInterval = ref(null)
const isPaused = ref(false)
const stepRefs = ref([])
const isVisible = ref(false)
const sectionRef = ref(null)

const steps = [
  {
    id: 1,
    num: '01',
    title: 'Create Use Cases',
    sentence: 'Define actors, system boundaries, and functional system use cases instantly in our semantic inspector.'
  },
  {
    id: 2,
    num: '02',
    title: 'Connect Relationships',
    sentence: 'Link nodes with compliant UML connectors. Choose association, include, or extend arrows.'
  },
  {
    id: 3,
    num: '03',
    title: 'Organize Automatically',
    sentence: 'Let our auto-layout engine align complex structures and route overlapping connectors with one click.'
  },
  {
    id: 4,
    num: '04',
    title: 'Export Anywhere',
    sentence: 'Export high-resolution SVGs, PNGs, or raw UML code states to embed directly in GitHub or markdown documentation.'
  }
]

const setActiveStep = (id) => {
  activeStep.value = id
}

// Arrow Key Navigation support
const selectPrev = () => {
  const currentIndex = steps.findIndex(s => s.id === activeStep.value)
  const prevIndex = (currentIndex - 1 + steps.length) % steps.length
  activeStep.value = steps[prevIndex].id
  focusActiveStep()
}

const selectNext = () => {
  const currentIndex = steps.findIndex(s => s.id === activeStep.value)
  const nextIndex = (currentIndex + 1) % steps.length
  activeStep.value = steps[nextIndex].id
  focusActiveStep()
}

const focusActiveStep = () => {
  nextTick(() => {
    const activeRef = stepRefs.value.find(
      el => el && el.getAttribute('aria-selected') === 'true'
    )
    if (activeRef) {
      activeRef.focus()
    }
  })
}

// Autoplay loop setup
const startRotation = () => {
  if (rotationInterval.value) return
  rotationInterval.value = setInterval(() => {
    if (!isPaused.value) {
      const currentIndex = steps.findIndex(s => s.id === activeStep.value)
      const nextIndex = (currentIndex + 1) % steps.length
      activeStep.value = steps[nextIndex].id
    }
  }, 5000)
}

const stopRotation = () => {
  if (rotationInterval.value) {
    clearInterval(rotationInterval.value)
    rotationInterval.value = null
  }
}

const pauseRotation = () => {
  isPaused.value = true
}

const resumeRotation = () => {
  isPaused.value = false
}

onMounted(() => {
  startRotation()

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

onUnmounted(() => {
  stopRotation()
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

/* Scoped transition for workspace updates */
.fade-workspace-enter-active,
.fade-workspace-leave-active {
  transition: opacity 0.25s cubic-bezier(0.16, 1, 0.3, 1), transform 0.25s cubic-bezier(0.16, 1, 0.3, 1);
}
.fade-workspace-enter-from {
  opacity: 0;
  transform: scale(0.95);
}
.fade-workspace-leave-to {
  opacity: 0;
  transform: scale(1.02);
}

@media (prefers-reduced-motion: reduce) {
  .transition-all,
  .animate-pulse,
  .cursor-blink,
  .fade-workspace-enter-active,
  .fade-workspace-leave-active {
    transition: none !important;
    animation: none !important;
    transform: none !important;
    opacity: 1 !important;
  }
}
</style>
