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
              
              <!-- 1. Workspace Top Toolbar -->
              <div class="h-10 border-b border-border-default bg-bg-surface flex items-center justify-between px-md select-none shrink-0">
                <div class="flex items-center gap-xs">
                  <span class="w-2.5 h-2.5 rounded-full bg-interactive-accent"></span>
                  <span class="text-[10px] font-mono font-medium text-text-muted uppercase tracking-wider">Workspace / SystemModel.uml</span>
                </div>
                <div class="flex items-center gap-sm">
                  <span class="text-[10px] font-mono text-text-muted bg-bg-elevated px-xs py-xxs border border-border-default rounded">⌘K Actions</span>
                </div>
              </div>

              <!-- 2. Workspace Body (Explorer + Dynamic Canvas + Inspector) -->
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
                      class="relative w-[520px] h-[340px] scale-[0.7] xs:scale-[0.8] sm:scale-90 md:scale-95 lg:scale-100 xl:scale-105 2xl:scale-115 origin-center shrink-0 transition-transform duration-350"
                    >
                      
                      <!-- Canvas Elements for Step 1: Create Classes -->
                      <template v-if="activeStep === 1">
                        <!-- Node 2: Order Class (Highlighted Selection) -->
                        <div class="absolute top-[100px] left-[175px] w-[140px] bg-bg-surface border-2 border-interactive-accent rounded-[4px] shadow-lg flex flex-col font-mono text-[9px] select-none text-left">
                          <div class="px-xs py-xxs text-center font-sans font-bold border-b border-border-default text-text-primary bg-bg-base/40">
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
                          <!-- Selection anchors indicators -->
                          <div class="absolute -top-1.5 -left-1.5 w-3 h-3 rounded-full bg-interactive-accent border-2 border-bg-surface"></div>
                          <div class="absolute -top-1.5 -right-1.5 w-3 h-3 rounded-full bg-interactive-accent border-2 border-bg-surface"></div>
                          <div class="absolute -bottom-1.5 -left-1.5 w-3 h-3 rounded-full bg-interactive-accent border-2 border-bg-surface"></div>
                          <div class="absolute -bottom-1.5 -right-1.5 w-3 h-3 rounded-full bg-interactive-accent border-2 border-bg-surface"></div>
                        </div>
                      </template>

                      <!-- Canvas Elements for Step 2: Connect Relationships -->
                      <template v-if="activeStep === 2">
                        <svg class="absolute inset-0 w-full h-full pointer-events-none" xmlns="http://www.w3.org/2000/svg">
                          <defs>
                            <marker id="composition-accent" viewBox="0 0 12 10" refX="0" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
                              <path d="M 0 5 L 6 0 L 12 5 L 6 10 z" fill="var(--color-interactive-accent)" stroke="var(--color-interactive-accent)" stroke-width="1.5" />
                            </marker>
                          </defs>
                          <!-- Dynamic Connection drawing preview line -->
                          <path d="M 120 145 L 120 85" fill="none" stroke="var(--color-interactive-accent)" stroke-width="2.5" stroke-dasharray="4,2" marker-start="url(#composition-accent)" />
                        </svg>

                        <!-- Node 1: Customer Class (Top) -->
                        <div class="absolute top-[10px] left-[50px] w-[140px] bg-bg-surface border border-border-default rounded-[4px] shadow-sm flex flex-col font-mono text-[9px] select-none text-left">
                          <div class="px-xs py-xxs text-center font-sans font-semibold border-b border-border-default text-text-primary bg-bg-base/40">
                            Customer
                          </div>
                          <div class="p-xxs flex flex-col text-text-secondary leading-tight">
                            <span>- id: String</span>
                            <span>- name: String</span>
                          </div>
                          <!-- Blue connector socket hover state -->
                          <div class="absolute bottom-[-4px] left-[50%] -translate-x-[50%] w-2 h-2 rounded-full bg-interactive-accent ring-4 ring-interactive-accent/30 animate-pulse"></div>
                        </div>

                        <!-- Node 2: Order Class (Bottom) -->
                        <div class="absolute top-[145px] left-[50px] w-[140px] bg-bg-surface border border-border-default rounded-[4px] shadow-sm flex flex-col font-mono text-[9px] select-none text-left">
                          <div class="px-xs py-xxs text-center font-sans font-semibold border-b border-border-default text-text-primary bg-bg-base/40">
                            Order
                          </div>
                          <div class="p-xxs flex flex-col text-text-secondary leading-tight">
                            <span>- orderId: String</span>
                            <span>- total: Float</span>
                          </div>
                          <!-- Blue connector socket hover state -->
                          <div class="absolute top-[-4px] left-[50%] -translate-x-[50%] w-2 h-2 rounded-full bg-interactive-accent ring-4 ring-interactive-accent/30"></div>
                        </div>
                      </template>

                      <!-- Canvas Elements for Step 3: Organize Automatically -->
                      <template v-if="activeStep === 3">
                        <svg class="absolute inset-0 w-full h-full pointer-events-none" xmlns="http://www.w3.org/2000/svg">
                          <defs>
                            <marker id="generalization-step" viewBox="0 0 10 10" refX="10" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                              <path d="M 0 0 L 10 5 L 0 10 z" fill="var(--color-bg-surface)" stroke="var(--color-text-secondary)" stroke-width="1.5" />
                            </marker>
                            <marker id="composition-step" viewBox="0 0 12 10" refX="0" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
                              <path d="M 0 5 L 6 0 L 12 5 L 6 10 z" fill="var(--color-text-secondary)" stroke="var(--color-text-secondary)" stroke-width="1.5" />
                            </marker>
                            <marker id="association-step" viewBox="0 0 10 10" refX="10" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                              <path d="M 0 1.5 L 10 5 L 0 8.5" fill="none" stroke="var(--color-text-secondary)" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                            </marker>
                          </defs>
                          <path d="M 90 130 L 90 70" fill="none" stroke="var(--color-text-secondary)" stroke-width="1.5" marker-start="url(#composition-step)" />
                          <path d="M 90 220 L 90 190" fill="none" stroke="var(--color-text-secondary)" stroke-width="1.5" marker-end="url(#association-step)" />
                          <path d="M 230 150 L 175 150" fill="none" stroke="var(--color-text-secondary)" stroke-width="1.5" marker-end="url(#association-step)" />
                          <path d="M 405 220 L 405 160" fill="none" stroke="var(--color-text-secondary)" stroke-width="1.5" stroke-dasharray="4,3" marker-end="url(#generalization-step)" />
                        </svg>

                        <!-- Aligned nodes -->
                        <div class="absolute top-[0px] left-[20px] w-[140px] bg-bg-surface border border-border-default rounded-[4px] shadow-sm flex flex-col font-mono text-[9px] select-none text-left">
                          <div class="px-xs py-xxs text-center font-sans font-semibold border-b border-border-default text-text-primary bg-bg-base/40">Customer</div>
                          <div class="p-xxs flex flex-col text-text-secondary leading-tight">
                            <span>- id: String</span>
                            <span>- name: String</span>
                          </div>
                        </div>

                        <div class="absolute top-[100px] left-[35px] w-[110px] bg-bg-surface border border-border-default rounded-[4px] shadow-sm flex flex-col font-mono text-[9px] select-none text-left">
                          <div class="px-xs py-xxs text-center font-sans font-semibold border-b border-border-default text-text-primary bg-bg-base/40">Order</div>
                          <div class="p-xxs flex flex-col text-text-secondary leading-tight">
                            <span>- orderId: String</span>
                            <span>- total: Float</span>
                          </div>
                        </div>

                        <div class="absolute top-[220px] left-[25px] w-[130px] bg-bg-surface border border-border-default rounded-[4px] shadow-sm flex flex-col font-mono text-[9px] select-none text-left">
                          <div class="px-xs py-xxs text-center font-sans font-semibold border-b border-border-default text-text-primary bg-bg-base/40">OrderController</div>
                          <div class="p-xxs flex flex-col text-text-secondary leading-tight">
                            <span>+ createOrder()</span>
                          </div>
                        </div>

                        <div class="absolute top-[115px] left-[230px] w-[110px] bg-bg-surface border border-border-default rounded-[4px] shadow-sm flex flex-col font-mono text-[9px] select-none text-left">
                          <div class="px-xs py-xxs text-center font-sans font-semibold border-b border-border-default text-text-primary bg-bg-base/40">PaymentService</div>
                          <div class="p-xxs flex flex-col text-text-secondary leading-tight">
                            <span>+ process(pay: Float)</span>
                          </div>
                        </div>

                        <div class="absolute top-[10px] right-[25px] w-[130px] bg-bg-surface border border-border-default rounded-[4px] shadow-sm flex flex-col font-mono text-[9px] select-none text-left">
                          <div class="px-xs py-xxs text-center border-b border-border-default bg-bg-base/40">
                            <span class="text-[8px] text-text-muted block">«interface»</span>
                            <span class="font-sans font-semibold text-text-primary">Repository</span>
                          </div>
                          <div class="p-xxs flex flex-col text-text-secondary leading-tight">
                            <span>+ save(entity: T)</span>
                          </div>
                        </div>

                        <div class="absolute top-[220px] right-[25px] w-[130px] bg-bg-surface border border-border-default rounded-[4px] shadow-sm flex flex-col font-mono text-[9px] select-none text-left">
                          <div class="px-xs py-xxs text-center font-sans font-semibold border-b border-border-default text-text-primary bg-bg-base/40">OrderRepository</div>
                          <div class="p-xxs flex flex-col text-text-secondary leading-tight">
                            <span>+ save(order: Order)</span>
                          </div>
                        </div>
                      </template>

                      <!-- Canvas Elements for Step 4: Export Anywhere -->
                      <template v-if="activeStep === 4">
                        <!-- Background diagram is shown blurred -->
                        <div class="absolute inset-0 blur-[2px] opacity-40">
                          <svg class="absolute inset-0 w-full h-full pointer-events-none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M 90 130 L 90 70" fill="none" stroke="var(--color-text-secondary)" stroke-width="1.5" />
                            <path d="M 230 150 L 175 150" fill="none" stroke="var(--color-text-secondary)" stroke-width="1.5" />
                          </svg>
                          <div class="absolute top-[20px] left-[20px] w-[130px] bg-bg-surface border border-border-default rounded-[4px] p-xxs text-[9px] font-mono">
                            Customer
                          </div>
                          <div class="absolute top-[100px] left-[35px] w-[110px] bg-bg-surface border border-border-default rounded-[4px] p-xxs text-[9px] font-mono">
                            Order
                          </div>
                        </div>

                        <!-- Absolute Modal Dialog Overlay for Export Settings -->
                        <div class="absolute inset-0 flex items-center justify-center p-md">
                          <Surface 
                            depth="3" 
                            radius="panel" 
                            class="w-[280px] p-md border border-border-elevated bg-bg-surface shadow-2xl flex flex-col gap-sm"
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
              <div class="h-6 border-t border-border-default bg-bg-surface flex items-center justify-between px-md text-[9px] font-mono text-text-muted select-none shrink-0">
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
import { ref, onMounted, onUnmounted, nextTick } from 'vue'
import Section from './layout/Section.vue'
import Container from './layout/Container.vue'
import Grid from './layout/Grid.vue'
import Stack from './layout/Stack.vue'
import Surface from './layout/Surface.vue'
import Button from './Button.vue'
import Badge from './Badge.vue'

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
    title: 'Create Classes',
    sentence: 'Define entities, attributes, and methods instantly in our semantic inspector or syntax editor.'
  },
  {
    id: 2,
    num: '02',
    title: 'Connect Relationships',
    sentence: 'Link nodes with compliant UML connectors. Choose composition, generalization, or association arrows.'
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
