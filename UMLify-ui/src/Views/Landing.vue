<template>
  <div class="bg-[#070a13] text-zinc-100 min-h-screen font-sans selection:bg-zinc-700 selection:text-white">
    
    <!-- SECTION 1 — HERO -->
    <section class="min-h-screen flex flex-col items-center justify-center bg-[#070a13] relative overflow-hidden px-6">
      
      <!-- DotField Background Block -->
      <div class="absolute inset-0 pointer-events-none z-0 overflow-hidden flex items-center justify-center">
        <div style="width: 1080px; height: 1080px; position: relative;">
          <DotField
            :dotRadius="2.5"
            :dotSpacing="17"
            :cursorRadius="500"
            :cursorForce="0.1"
            bulgeOnly
            :bulgeStrength="67"
            :glowRadius="160"
            :sparkle="false"
            :waveAmplitude="0"
            gradientFrom="rgba(168, 85, 247, 0.35)"
            gradientTo="rgba(180, 151, 207, 0.25)"
            glowColor="#120F17"
          />
        </div>
      </div>

      <!-- Ambient Background Orbs -->
      <div class="absolute w-[480px] h-[480px] rounded-full bg-indigo-600/10 blur-[120px] top-[-80px] left-[-120px] pointer-events-none orb-1"></div>
      <div class="absolute w-[360px] h-[360px] rounded-full bg-violet-500/8 blur-[100px] bottom-[-60px] right-[-80px] pointer-events-none orb-2"></div>

      <!-- Headline -->
      <h1 class="text-5xl md:text-7xl font-black tracking-tight leading-none bg-gradient-to-br from-white via-zinc-100 to-zinc-400 bg-clip-text text-transparent text-center select-none relative z-10">
        Diagram Faster.<br />Think Clearer.
      </h1>

      <!-- Subtitle -->
      <p class="mt-6 text-zinc-400 text-lg md:text-xl max-w-xl text-center leading-relaxed select-none relative z-10">
        UMLify compiles your architecture into precise UML diagrams — powered by AI, refined by you.
      </p>

      <!-- CTA Button -->
      <RouterLink to="/workspace" class="relative z-10">
        <button class="cta-btn mt-10 px-8 py-3.5 rounded-xl bg-indigo-600 text-white font-semibold text-base tracking-wide shadow-lg shadow-indigo-600/30 transition-all duration-300 ease-out hover:bg-indigo-500 hover:shadow-indigo-500/50 hover:scale-105 active:scale-95 cursor-pointer">
          Launch Workspace →
        </button>
      </RouterLink>
    </section>

    <!-- SECTION 2 — ANIMATED PREVIEW CARD -->
    <section class="py-24 px-6 flex justify-center items-center bg-[#070a13] relative overflow-hidden">
      <!-- Outer wrapper -->
      <div class="relative w-full max-w-4xl">
        <!-- Card with 3D Skew Transform -->
        <div 
          @mouseenter="isHovered = true" 
          @mouseleave="isHovered = false"
          :style="isHovered ? { transform: 'perspective(1000px) rotateX(1.5deg) rotateY(-1.5deg)' } : {}"
          class="rounded-2xl border border-zinc-700/50 bg-zinc-900/60 backdrop-blur-sm overflow-hidden shadow-2xl shadow-black/60 transition-all duration-500 ease-out hover:shadow-indigo-900/20"
        >
          <!-- Fake Browser Chrome Titlebar -->
          <div class="h-8 bg-zinc-800/80 flex items-center px-4 gap-1.5 border-b border-zinc-800/40">
            <span class="w-2.5 h-2.5 rounded-full bg-red-500/70"></span>
            <span class="w-2.5 h-2.5 rounded-full bg-yellow-500/70"></span>
            <span class="w-2.5 h-2.5 rounded-full bg-green-500/70"></span>
          </div>

          <!-- Sandbox Area -->
          <div class="h-72 md:h-96 bg-zinc-950 relative overflow-hidden">
            <!-- Faint Grid Background -->
            <div 
              class="absolute inset-0"
              style="background-image: linear-gradient(rgba(99,102,241,0.06) 1px, transparent 1px), linear-gradient(90deg, rgba(99,102,241,0.06) 1px, transparent 1px); background-size: 32px 32px;"
            ></div>

            <!-- Mockup Node Boxes -->
            <div class="absolute top-[20%] left-[10%] z-10 rounded-lg border border-zinc-600/60 bg-zinc-800/80 px-4 py-2 text-[10px] md:text-xs text-zinc-300 font-mono shadow-md">
              <span class="text-indigo-400 block text-[9px] mb-0.5">«interface»</span>
              IRenderer
            </div>

            <div class="absolute top-[55%] left-[38%] z-10 rounded-lg border border-zinc-600/60 bg-zinc-800/80 px-4 py-2 text-[10px] md:text-xs text-zinc-300 font-mono shadow-md">
              <span class="text-indigo-400 block text-[9px] mb-0.5">«class»</span>
              DiagramEngine
            </div>

            <div class="absolute top-[25%] left-[65%] z-10 rounded-lg border border-zinc-600/60 bg-zinc-800/80 px-4 py-2 text-[10px] md:text-xs text-zinc-300 font-mono shadow-md">
              <span class="text-indigo-400 block text-[9px] mb-0.5">«abstract»</span>
              BaseNode
            </div>

            <div class="absolute top-[65%] left-[72%] z-10 rounded-lg border border-zinc-600/60 bg-zinc-800/80 px-4 py-2 text-[10px] md:text-xs text-zinc-300 font-mono shadow-md">
              <span class="text-indigo-400 block text-[9px] mb-0.5">«class»</span>
              CanvasGrid
            </div>

            <!-- SVG Connecting Lines -->
            <svg class="absolute inset-0 w-full h-full pointer-events-none z-0" viewBox="0 0 800 384" preserveAspectRatio="none">
              <!-- Line from IRenderer (approx left: 20%, top: 28%) to DiagramEngine (approx left: 48%, top: 63%) -->
              <line x1="20%" y1="28%" x2="48%" y2="63%" stroke="#6366f1" stroke-opacity="0.4" stroke-width="1.5" />
              <!-- Line from BaseNode (approx left: 75%, top: 33%) to DiagramEngine (approx left: 48%, top: 63%) -->
              <line x1="75%" y1="33%" x2="48%" y2="63%" stroke="#6366f1" stroke-opacity="0.4" stroke-width="1.5" />
              <!-- Line from DiagramEngine (approx left: 48%, top: 63%) to CanvasGrid (approx left: 82%, top: 73%) -->
              <line x1="48%" y1="63%" x2="82%" y2="73%" stroke="#6366f1" stroke-opacity="0.4" stroke-width="1.5" />
            </svg>
          </div>
        </div>
      </div>
    </section>

    <!-- SECTION 3 — FEATURES GRID -->
    <section class="py-24 px-6 bg-[#070a13] relative overflow-hidden">
      <div class="max-w-6xl mx-auto">
        <!-- Eyebrow -->
        <p class="text-indigo-400 text-sm font-semibold uppercase tracking-widest text-center mb-4">Core Capabilities</p>
        <!-- Heading -->
        <h2 class="text-3xl md:text-4xl font-bold text-white text-center mb-16 tracking-tight">Built for precision. Designed for speed.</h2>

        <!-- 3-column Grid -->
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
          <!-- Card 1: AI Compiler Engine -->
          <div class="rounded-2xl bg-zinc-900/40 border border-zinc-800/60 p-8 flex flex-col gap-4 transition-all duration-300 ease-out hover:-translate-y-1 hover:shadow-xl hover:shadow-black/40 hover:border-zinc-700/80">
            <div class="w-10 h-10 rounded-xl bg-indigo-600/15 flex items-center justify-center text-indigo-400">
              <!-- circuit/spark SVG path -->
              <svg class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M4 10h4l3-6 3 12 3-8 4 2"/>
                <circle cx="4" cy="10" r="1"/>
                <circle cx="20" cy="12" r="1"/>
              </svg>
            </div>
            <h3 class="text-white font-semibold text-lg">AI Compiler Engine</h3>
            <p class="text-zinc-400 text-sm leading-relaxed">
              Describe your system in plain language. UMLify's AI engine translates intent into structured UML — class, sequence, and component diagrams on demand.
            </p>
          </div>

          <!-- Card 2: Zero-Lag Snapping Grid -->
          <div class="rounded-2xl bg-zinc-900/40 border border-zinc-800/60 p-8 flex flex-col gap-4 transition-all duration-300 ease-out hover:-translate-y-1 hover:shadow-xl hover:shadow-black/40 hover:border-zinc-700/80">
            <div class="w-10 h-10 rounded-xl bg-indigo-600/15 flex items-center justify-center text-indigo-400">
              <!-- grid/magnet SVG path -->
              <svg class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <rect x="3" y="3" width="18" height="18" rx="2" />
                <path d="M9 3v18M15 3v18M3 9h18M3 15h18" />
              </svg>
            </div>
            <h3 class="text-white font-semibold text-lg">Zero-Lag Snapping Grid</h3>
            <p class="text-zinc-400 text-sm leading-relaxed">
              Every node, connector, and label locks to a precision grid. Drag, align, and reposition with pixel-perfect snapping across any diagram scale.
            </p>
          </div>

          <!-- Card 3: Manual Stacking Controls -->
          <div class="rounded-2xl bg-zinc-900/40 border border-zinc-800/60 p-8 flex flex-col gap-4 transition-all duration-300 ease-out hover:-translate-y-1 hover:shadow-xl hover:shadow-black/40 hover:border-zinc-700/80">
            <div class="w-10 h-10 rounded-xl bg-indigo-600/15 flex items-center justify-center text-indigo-400">
              <!-- layers SVG path -->
              <svg class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <polygon points="12 2 2 7 12 12 22 7 12 2"/>
                <polyline points="2 17 12 22 22 17"/>
                <polyline points="2 12 12 17 22 12"/>
              </svg>
            </div>
            <h3 class="text-white font-semibold text-lg">Manual Stacking Controls</h3>
            <p class="text-zinc-400 text-sm leading-relaxed">
              Take full control over z-order, grouping, and visual hierarchy. Layer complex diagrams without collision or overlap — every time.
            </p>
          </div>
        </div>
      </div>
    </section>

    <!-- SECTION 4 — FOOTER -->
    <footer class="border-t border-zinc-800/60 bg-[#070a13] py-10 px-6 relative overflow-hidden">
      <div class="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        <span class="text-zinc-500 text-sm">© 2025 UMLify. All rights reserved.</span>
        <span class="text-xs text-zinc-600 border border-zinc-800 rounded-full px-3 py-1 bg-zinc-900/50 select-none">
          University Project — Academic Build
        </span>
      </div>
    </footer>

  </div>
</template>

<script setup>
import { ref } from 'vue'
import { RouterLink } from 'vue-router'
import DotField from '../components/DotField.vue'

const isHovered = ref(false)
</script>

<style scoped>
@keyframes float {
  from { transform: translateY(0px); }
  to   { transform: translateY(-24px); }
}

@keyframes pulse-ring {
  0%   { transform: scale(1);   opacity: 0.4; }
  100% { transform: scale(1.5); opacity: 0; }
}

.orb-1 {
  animation: float 6s ease-in-out infinite alternate;
}

.orb-2 {
  animation: float 8s ease-in-out infinite alternate-reverse;
}

.cta-btn {
  position: relative;
}

.cta-btn::before {
  content: '';
  position: absolute;
  inset: 0;
  border-radius: inherit;
  box-shadow: 0 0 0 2px rgba(99, 102, 241, 0.5);
  animation: pulse-ring 2.4s ease-out infinite;
  pointer-events: none;
}

@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
  }
}
</style>