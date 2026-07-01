<template>
  <Surface
    depth="2"
    radius="md"
    class="w-full h-[300px] flex flex-col overflow-hidden border border-border-default bg-bg-surface/20 shadow-2xl relative select-none"
    @mouseenter="pauseAnimation"
    @mouseleave="resumeAnimation"
  >
    <!-- Workspace Header Toolbar -->
    <div class="h-8 border-b border-border-default bg-bg-surface flex items-center justify-between px-md select-none shrink-0 text-[9px] font-mono text-text-muted">
      <div class="flex items-center gap-xs">
        <!-- Status indicator -->
        <span class="w-1.5 h-1.5 rounded-full bg-interactive-accent animate-pulse"></span>
        <span class="uppercase tracking-wider font-semibold">Workspace / OrderSystem.uml</span>
      </div>
      <div class="flex items-center gap-xs">
        <span class="px-xs py-xxs bg-bg-elevated border border-border-default rounded text-[8px]">⌘K Commands</span>
      </div>
    </div>

    <!-- Active Canvas Workspace -->
    <div class="flex-1 sheet-grid relative p-sm overflow-hidden min-h-0 flex items-center justify-center">
      
      <!-- UML Connector Lines -->
      <svg
        v-if="showClass1 && showClass2"
        class="absolute inset-0 w-full h-full pointer-events-none z-10"
      >
        <line
          x1="180"
          y1="130"
          :x2="class2Position.x + 35"
          y2="130"
          class="stroke-text-secondary transition-all duration-100"
          stroke-width="1.2"
        />
        <path
          :d="`M ${class2Position.x + 35} 130 L ${class2Position.x + 40} 127 M ${class2Position.x + 35} 130 L ${class2Position.x + 40} 133`"
          fill="none"
          class="stroke-text-secondary transition-all duration-100"
          stroke-width="1.2"
        />
      </svg>

      <!-- UML Class Node 1 -->
      <div
        v-if="showClass1"
        class="absolute left-[50px] top-[90px] w-[95px] h-[65px] border rounded bg-bg-base flex flex-col justify-between text-left p-xs z-20 transition-all duration-300 transform scale-100"
        :class="[
          step === 4 || step === 5 
            ? 'ring-2 ring-interactive-accent border-transparent shadow-md' 
            : 'border-border-default'
        ]"
      >
        <div class="border-b border-border-default/50 pb-xxs mb-xxs flex items-center justify-between">
          <span class="text-[7.5px] font-bold font-sans tracking-tight text-text-primary">
            {{ classLabel || '&nbsp;' }}
            <span
              v-if="step === 5"
              class="inline-block w-[1px] h-3 bg-interactive-accent animate-pulse align-middle ml-[0.5px]"
            ></span>
          </span>
        </div>
        <div class="flex-1 flex flex-col justify-end gap-[2px] font-mono text-[5.5px] text-text-secondary leading-none">
          <span>+ id: UUID</span>
          <span>+ date: Date</span>
          <span>+ checkout()</span>
        </div>
      </div>

      <!-- UML Class Node 2 (Duplicate) -->
      <div
        v-if="showClass2"
        class="absolute top-[90px] w-[95px] h-[65px] border rounded bg-bg-base flex flex-col justify-between text-left p-xs z-20 transition-all duration-100 transform scale-100"
        :style="{ left: `${class2Position.x}px` }"
        :class="[
          step === 6 || step === 7 
            ? 'ring-2 ring-interactive-accent border-transparent shadow-md' 
            : 'border-border-default'
        ]"
      >
        <div class="border-b border-border-default/50 pb-xxs mb-xxs flex items-center justify-between">
          <span class="text-[7.5px] font-bold font-sans tracking-tight text-text-primary">
            OrderService
          </span>
        </div>
        <div class="flex-1 flex flex-col justify-end gap-[2px] font-mono text-[5.5px] text-text-secondary leading-none">
          <span>+ id: UUID</span>
          <span>+ date: Date</span>
          <span>+ checkout()</span>
        </div>
      </div>

      <!-- Command Palette Omnibar Overlay -->
      <transition name="fade">
        <div
          v-if="step >= 1 && step <= 3"
          class="absolute inset-0 bg-black/15 backdrop-blur-[0.5px] flex items-start justify-center pt-8 z-30"
        >
          <div class="w-[85%] max-w-[250px] border border-border-elevated bg-bg-surface shadow-2xl rounded-card overflow-hidden">
            <!-- Search Input field -->
            <div class="h-8 border-b border-border-default flex items-center px-sm gap-xs bg-bg-base/30 text-[10px]">
              <span class="text-text-muted font-mono">⌘</span>
              <span class="relative flex-1 text-left text-text-primary font-medium">
                {{ typedText }}
                <span
                  v-if="step === 2"
                  class="inline-block w-[1px] h-3 bg-interactive-accent align-middle animate-pulse ml-[0.5px]"
                ></span>
              </span>
            </div>
            <!-- Matching Action Items list -->
            <div class="p-xxs flex flex-col gap-xxs select-none">
              <div
                v-for="(item, idx) in filteredPaletteItems"
                :key="item.text"
                class="flex items-center justify-between px-sm py-xs rounded text-[9.5px] text-left transition-colors duration-150"
                :class="idx === activeIndex ? 'bg-bg-elevated text-text-primary font-semibold' : 'text-text-secondary'"
              >
                <span>{{ item.text }}</span>
                <kbd
                  v-if="idx === activeIndex"
                  class="text-[8px] opacity-60 font-mono"
                >
                  ⏎
                </kbd>
              </div>
              <div
                v-if="filteredPaletteItems.length === 0"
                class="py-xs text-center text-[9px] text-text-muted"
              >
                No actions found
              </div>
            </div>
          </div>
        </div>
      </transition>

      <!-- Export Success Dialog Overlay -->
      <transition name="fade">
        <div
          v-if="showExportDialog"
          class="absolute inset-0 bg-black/20 backdrop-blur-[0.5px] flex items-center justify-center z-30"
        >
          <div class="w-[180px] p-sm border border-border-elevated bg-bg-surface shadow-2xl rounded-card flex flex-col gap-xs text-left">
            <div class="flex items-center gap-xs">
              <span class="text-success text-[11px] font-bold">✓</span>
              <span class="text-[10px] font-bold text-text-primary">SVG Export Successful</span>
            </div>
            <p class="text-[9px] text-text-secondary leading-relaxed">
              OrderSystem.svg was compiled and saved to downloads.
            </p>
          </div>
        </div>
      </transition>
    </div>

    <!-- Bottom Keystroke Strip Debugger -->
    <div class="h-8 border-t border-border-default bg-bg-surface/50 flex items-center justify-center px-md select-none shrink-0 gap-xs text-[9px] font-mono text-text-muted">
      <span class="text-[8px] uppercase tracking-wider text-text-muted/80 mr-xs select-none">Keystroke:</span>
      <div class="flex items-center gap-xxs">
        <transition-group name="pop">
          <kbd
            v-for="k in activeKeys"
            :key="k"
            class="px-xs py-[1px] font-bold rounded bg-bg-elevated border border-border-default/80 shadow-xs text-text-primary scale-100 text-[8.5px] transition-all duration-150"
          >
            {{ k }}
          </kbd>
        </transition-group>
        <span
          v-if="activeKeys.length === 0"
          class="text-[8px] italic text-text-muted/50 select-none"
        >
          waiting...
        </span>
      </div>
    </div>
  </Surface>
</template>

<script setup>
import { ref, onMounted, onUnmounted, computed } from 'vue'
import Surface from '../ui/layout/Surface.vue'

const step = ref(0)
const isPaused = ref(false)
const typedText = ref('')
const classLabel = ref('')
const activeIndex = ref(0)
const showExportDialog = ref(false)
const showClass1 = ref(false)
const showClass2 = ref(false)
const class2Position = ref({ x: 50, y: 90 })
const activeKeys = ref([])

const paletteItems = [
  { text: 'Create Class Node', desc: 'Create a new structural box' },
  { text: 'Create Sequence Call', desc: 'Add message flow' },
  { text: 'Delete Selected Node', desc: 'Remove object' },
  { text: 'Export SVG Asset', desc: 'Compile SVG output' }
]

const filteredPaletteItems = computed(() => {
  if (!typedText.value) return paletteItems
  return paletteItems.filter(item =>
    item.text.toLowerCase().includes(typedText.value.toLowerCase())
  )
})

let timer = null
let keyInterval = null

function runAnimation() {
  if (isPaused.value) return

  // Step 0: Idle state (1.5s)
  step.value = 0
  typedText.value = ''
  classLabel.value = ''
  activeIndex.value = 0
  showClass1.value = false
  showClass2.value = false
  class2Position.value = { x: 50, y: 90 }
  showExportDialog.value = false
  activeKeys.value = []

  timer = setTimeout(() => {
    // Step 1: Trigger Omnibar Command Ctrl+K (0.8s)
    step.value = 1
    activeKeys.value = ['Ctrl', 'K']

    timer = setTimeout(() => {
      // Step 2: Open Palette, start typing "create class" (1.5s)
      step.value = 2
      activeKeys.value = []
      typeText('create class', typedText, 80, () => {
        // Step 3: Highlight target filter and press Enter (0.8s)
        step.value = 3
        activeIndex.value = 0
        activeKeys.value = ['Enter']

        timer = setTimeout(() => {
          // Step 4: Omnibar closes, Class box appears, Tab triggers focus (0.8s)
          step.value = 4
          showClass1.value = true
          classLabel.value = ''
          activeKeys.value = ['Tab']

          timer = setTimeout(() => {
            // Step 5: Type Class Name "OrderService" (1.5s)
            step.value = 5
            activeKeys.value = []
            typeText('OrderService', classLabel, 90, () => {
              // Step 6: Press Ctrl+D to duplicate node (0.8s)
              step.value = 6
              showClass2.value = true
              class2Position.value = { x: 50, y: 90 }
              activeKeys.value = ['Ctrl', 'D']

              timer = setTimeout(() => {
                // Step 7: Press arrow keys to shift position (1.2s)
                step.value = 7
                activeKeys.value = ['→']
                
                let px = 50
                keyInterval = setInterval(() => {
                  if (isPaused.value) {
                    clearInterval(keyInterval)
                    return
                  }
                  px += 10
                  class2Position.value = { x: px, y: 90 }
                  if (px >= 240) {
                    clearInterval(keyInterval)
                  }
                }, 80)

                timer = setTimeout(() => {
                  clearInterval(keyInterval)
                  class2Position.value = { x: 240, y: 90 }
                  // Step 8: Trigger SVG Export Ctrl+Shift+E (1.2s)
                  step.value = 8
                  showExportDialog.value = true
                  activeKeys.value = ['Ctrl', 'Shift', 'E']

                  timer = setTimeout(() => {
                    // Step 9: Reset Dialog
                    showExportDialog.value = false
                    runAnimation()
                  }, 1200)
                }, 1300)
              }, 800)
            })
          }, 800)
        }, 800)
      })
    }, 800)
  }, 1500)
}

function typeText(target, refVal, speed, callback) {
  let index = 0
  const interval = setInterval(() => {
    if (isPaused.value) {
      clearInterval(interval)
      return
    }
    index++
    refVal.value = target.slice(0, index)
    if (index >= target.length) {
      clearInterval(interval)
      setTimeout(callback, 250)
    }
  }, speed)
}

function pauseAnimation() {
  isPaused.value = true
  clearTimeout(timer)
  clearInterval(keyInterval)
}

function resumeAnimation() {
  isPaused.value = false
  runAnimation()
}

onMounted(() => {
  runAnimation()
})

onUnmounted(() => {
  clearTimeout(timer)
  clearInterval(keyInterval)
})
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.15s ease-out;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.pop-enter-active {
  animation: popKey 0.12s cubic-bezier(0.16, 1, 0.3, 1);
}
.pop-leave-active {
  animation: popKey 0.12s cubic-bezier(0.16, 1, 0.3, 1) reverse;
}

@keyframes popKey {
  0% {
    transform: scale(0.9);
    opacity: 0;
  }
  100% {
    transform: scale(1);
    opacity: 1;
  }
}

@media (prefers-reduced-motion: reduce) {
  .transform,
  .transition-all,
  .animate-pulse,
  .fade-enter-active,
  .fade-leave-active,
  .pop-enter-active,
  .pop-leave-active {
    transition: none !important;
    animation: none !important;
    transform: none !important;
    opacity: 1 !important;
  }
}
</style>
