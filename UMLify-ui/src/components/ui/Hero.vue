<template>
  <Section spacing="xxl" custom-class="flex items-center min-h-[calc(100vh-56px)]">
    <Container size="xl">
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
              class="text-4xl lg:text-5xl font-bold tracking-tight text-text-primary leading-[1.1] text-left transition-all duration-350 ease-tactile transform"
              :class="isMounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'"
              style="transition-delay: 200ms;"
            >
              The fastest way to design professional UML diagrams.
            </h1>

            <!-- Supporting Paragraph -->
            <p
              class="text-base text-text-secondary leading-relaxed max-w-lg text-left transition-all duration-350 ease-tactile transform"
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
              class="pt-md w-full border-t border-border-default/50 text-left transition-all duration-350 ease-tactile transform"
              :class="isMounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'"
              style="transition-delay: 500ms;"
            >
              <span class="text-xxs font-mono uppercase tracking-widest text-text-muted block mb-xs">
                Engineered for speed, compliance, and workflow integration
              </span>
              <div class="flex flex-wrap items-center gap-sm text-text-muted text-xs font-semibold">
                <span>✓ UML 2.5 Compliance</span>
                <span class="text-border-default/85">•</span>
                <span>✓ Auto-Layout Snapping</span>
                <span class="text-border-default/85">•</span>
                <span>✓ Instant SVG Export</span>
                <span class="text-border-default/85">•</span>
                <span>✓ Keyboard Shortcuts</span>
              </div>
            </div>
            
          </Stack>
        </div>

        <!-- Right Column: Workspace Editor Preview -->
        <div
          class="col-span-12 lg:col-span-7 flex items-stretch min-h-[460px] md:min-h-[520px] lg:min-h-[560px] transition-all duration-350 ease-tactile transform"
          :class="isMounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'"
          style="transition-delay: 600ms;"
        >
          <Surface
            depth="2"
            radius="lg"
            class="w-full h-full flex flex-col overflow-hidden border border-border-default bg-bg-surface/40 shadow-2xl"
          >
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
              
              <!-- Left Sidebar: File Tree Explorer (hidden on mobile) -->
              <div class="hidden sm:flex w-44 border-r border-border-default bg-bg-surface/60 flex-col p-xs select-none shrink-0 text-left">
                <span class="text-[9px] font-mono uppercase tracking-widest text-text-muted mb-xs px-xs">Explorer</span>
                <div class="flex flex-col gap-xxs text-[11px] font-medium">
                  <div class="flex items-center gap-xs px-xs py-xxs bg-bg-elevated/60 rounded text-text-primary">
                    <span class="text-interactive-accent">❖</span> SystemModel.uml
                  </div>
                  <div class="flex items-center gap-xs px-xs py-xxs text-text-secondary hover:bg-bg-elevated/35 rounded cursor-pointer">
                    <span>◇</span> OrderController.java
                  </div>
                  <div class="flex items-center gap-xs px-xs py-xxs text-text-secondary hover:bg-bg-elevated/35 rounded cursor-pointer">
                    <span>◇</span> PaymentService.java
                  </div>
                  <div class="flex items-center gap-xs px-xs py-xxs text-text-secondary hover:bg-bg-elevated/35 rounded cursor-pointer">
                    <span>◇</span> OrderRepository.java
                  </div>
                </div>
              </div>

              <!-- Main Canvas area with dot grid and UML diagrams -->
              <div class="flex-1 sheet-grid relative overflow-hidden flex items-center justify-center p-sm">
                <!-- Wrapper scaled down for responsiveness to fit all viewports without clipping -->
                <div class="relative w-[520px] h-[340px] scale-[0.7] xs:scale-[0.8] sm:scale-95 md:scale-100 origin-center shrink-0">
                  
                  <!-- SVG Connector Paths (UML lines) -->
                  <svg class="absolute inset-0 w-full h-full pointer-events-none" xmlns="http://www.w3.org/2000/svg">
                    <defs>
                      <!-- Generalization (Hollow triangle) -->
                      <marker id="generalization" viewBox="0 0 10 10" refX="10" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                        <path d="M 0 0 L 10 5 L 0 10 z" fill="var(--color-bg-surface)" stroke="var(--color-text-secondary)" stroke-width="1.5" />
                      </marker>
                      <!-- Composition (Filled diamond) -->
                      <marker id="composition" viewBox="0 0 12 10" refX="0" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
                        <path d="M 0 5 L 6 0 L 12 5 L 6 10 z" fill="var(--color-text-secondary)" stroke="var(--color-text-secondary)" stroke-width="1.5" />
                      </marker>
                      <!-- Association (Simple arrowhead) -->
                      <marker id="association" viewBox="0 0 10 10" refX="10" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                        <path d="M 0 1.5 L 10 5 L 0 8.5" fill="none" stroke="var(--color-text-secondary)" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                      </marker>
                    </defs>

                    <!-- Lines -->
                    <!-- Customer to Order (Composition) -->
                    <path d="M 90 130 L 90 70" fill="none" stroke="var(--color-text-secondary)" stroke-width="1.5" marker-start="url(#composition)" />
                    <!-- OrderController to Order (Association) -->
                    <path d="M 90 220 L 90 190" fill="none" stroke="var(--color-text-secondary)" stroke-width="1.5" marker-end="url(#association)" />
                    <!-- PaymentService to Order (Association) -->
                    <path d="M 230 150 L 175 150" fill="none" stroke="var(--color-text-secondary)" stroke-width="1.5" marker-end="url(#association)" />
                    <!-- Repository to OrderRepository (Realization - dashed) -->
                    <path d="M 405 220 L 405 160" fill="none" stroke="var(--color-text-secondary)" stroke-width="1.5" stroke-dasharray="4,3" marker-end="url(#generalization)" />
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

              <!-- Right Sidebar: Inspector Properties (hidden on mobile/tablet) -->
              <div class="hidden lg:flex w-48 border-l border-border-default bg-bg-surface/60 flex-col p-xs select-none shrink-0 text-left">
                <span class="text-[9px] font-mono uppercase tracking-widest text-text-muted mb-xs px-xs">Inspector</span>
                <div class="flex flex-col gap-sm text-[11px] p-xs">
                  <div>
                    <span class="text-[9px] font-mono text-text-muted block mb-xxs">Entity Type</span>
                    <span class="font-medium text-text-primary">Class Node</span>
                  </div>
                  <div>
                    <span class="text-[9px] font-mono text-text-muted block mb-xxs">Class Name</span>
                    <div class="font-mono text-xs text-text-primary bg-bg-elevated px-xs py-xxs rounded flex items-center gap-[2px] w-full border border-border-default select-none">
                      <span>Order</span>
                      <span class="w-[1.5px] h-3 bg-interactive-accent cursor-blink"></span>
                    </div>
                  </div>
                  <div>
                    <span class="text-[9px] font-mono text-text-muted block mb-xxs">Visibility</span>
                    <span class="font-medium text-text-primary">Public (+)</span>
                  </div>
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
