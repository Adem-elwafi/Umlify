<template>
  <div class="w-full h-full bg-zinc-950 border-l border-zinc-900 flex flex-col p-4 font-sans text-zinc-300">
    <!-- Panel Header -->
    <div class="flex items-center justify-between mb-4 shrink-0">
      <div class="flex items-center space-x-3">
        <div class="flex space-x-1.5">
          <span class="w-2.5 h-2.5 rounded-full bg-zinc-800"></span>
          <span class="w-2.5 h-2.5 rounded-full bg-zinc-800"></span>
          <span class="w-2.5 h-2.5 rounded-full bg-zinc-800"></span>
        </div>
        <h2 class="text-[10px] font-bold tracking-wider uppercase text-zinc-500 select-none font-mono">
          AI Architecture Compiler
        </h2>
      </div>
      <div class="flex items-center space-x-2">
        <div v-if="successMessage" class="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.6)] animate-pulse"></div>
        <div v-else class="w-2 h-2 rounded-full bg-zinc-800"></div>
        <span class="text-[9px] font-bold text-zinc-600 uppercase tracking-widest">{{ successMessage ? 'Active' : 'Standby' }}</span>
      </div>
    </div>

    <!-- Info Section -->
    <div class="mb-4 p-3 bg-zinc-900/30 border border-zinc-800/50 rounded-xl shrink-0">
      <p class="text-[10px] text-zinc-500 leading-relaxed">
        <span class="text-zinc-300 font-bold uppercase mr-1.5">Blueprint Protocol:</span>
        Input a valid JSON payload containing <code class="text-zinc-300 font-mono">elements</code> and <code class="text-zinc-300 font-mono">connections</code> arrays to instantiate the vector architecture.
      </p>
    </div>

    <!-- Main Input Area -->
    <div class="flex-1 min-h-0 mb-4 relative group">
      <div class="absolute inset-0 bg-gradient-to-b from-zinc-900/20 to-transparent pointer-events-none rounded-lg"></div>
      <textarea
        v-model="jsonInput"
        placeholder='{&#10;  "elements": [...],&#10;  "connections": [...]&#10;}'
        class="w-full h-full bg-zinc-900/50 border border-zinc-800/80 rounded-lg p-4 text-xs font-mono text-zinc-100 placeholder-zinc-700 focus:outline-none focus:border-zinc-700 focus:ring-1 focus:ring-zinc-800 transition-all shadow-inner resize-none overflow-y-auto leading-relaxed tab-size-2"
        spellcheck="false"
      ></textarea>
    </div>

    <!-- Feedback Area -->
    <div class="mb-4 shrink-0">
      <transition name="fade" mode="out-in">
        <div v-if="errorLog" class="bg-rose-950/20 border border-rose-900/30 p-3 rounded-lg">
          <div class="flex items-center space-x-2 mb-1">
            <span class="text-rose-500 text-[10px]">●</span>
            <span class="text-[10px] font-bold text-rose-500 uppercase tracking-wider">Compilation Error</span>
          </div>
          <p class="text-[11px] text-rose-400/80 font-mono leading-tight whitespace-pre-wrap">{{ errorLog }}</p>
        </div>
        <div v-else-if="successMessage" class="bg-emerald-950/20 border border-emerald-900/30 p-3 rounded-lg">
          <div class="flex items-center space-x-2 mb-1">
            <span class="text-emerald-500 text-[10px]">●</span>
            <span class="text-[10px] font-bold text-emerald-500 uppercase tracking-wider">Success</span>
          </div>
          <p class="text-[11px] text-emerald-400/80 font-mono leading-tight">{{ successMessage }}</p>
        </div>
        <div v-else class="flex items-center space-x-2 px-1">
          <span class="text-zinc-800 text-[10px]">❯</span>
          <span class="text-[10px] font-medium text-zinc-600 font-mono">Ready for telemetry transmission...</span>
        </div>
      </transition>
    </div>

    <!-- Action Block -->
    <button 
      @click="compileDiagram" 
      :disabled="!jsonInput.trim()"
      class="w-full py-2.5 bg-zinc-100 hover:bg-zinc-200 active:scale-[0.98] disabled:opacity-40 disabled:pointer-events-none text-zinc-950 font-semibold text-xs rounded-lg shadow-md transition-all flex items-center justify-center space-x-2 cursor-pointer group"
    >
      <svg class="w-3.5 h-3.5 group-hover:rotate-12 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M13 10V3L4 14h7v7l9-11h-7z" />
      </svg>
      <span>Compile Architecture</span>
    </button>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useDiagramStore } from '../stores/diagramStore'

const diagramStore = useDiagramStore()
const jsonInput = ref('')
const errorLog = ref(null)
const successMessage = ref('')

const compileDiagram = () => {
  // Reset logs
  errorLog.value = null
  successMessage.value = ''

  if (!jsonInput.value.trim()) {
    errorLog.value = "Input stream buffer is empty. Paste an AI generated payload first."
    return
  }

  try {
    const payload = JSON.parse(jsonInput.value)

    if (!payload.elements || !Array.isArray(payload.elements)) {
      throw new Error("Missing root 'elements' node tracking array layer.")
    }

    // 1. SAFE STATE INITIALIZATION
    diagramStore.resetDiagram()

    // Map referencing dictionary for index matching pipelines
    const elementIdMapping = {}

    // 2. COMPONENT CASING ALIGNMENT & NODE GENERATION
    payload.elements.forEach((el, index) => {
      const generatedId = `${el.type?.toLowerCase() || 'node'}-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`
      elementIdMapping[index] = generatedId

      let normalizedType = el.type || 'usecase'
      const lowerType = String(normalizedType).toLowerCase()

      if (lowerType === 'actor') {
        normalizedType = 'actor'
      } else if (lowerType === 'usecase' || lowerType === 'use-case') {
        normalizedType = 'usecase'
      } else if (lowerType === 'system') {
        normalizedType = 'System'
      }

      const nodePayload = {
        id: generatedId,
        type: normalizedType,
        label: el.label || 'Default Node',
        x: Number(el.x) || 100,
        y: Number(el.y) || 100,
        width: Number(el.width) || (normalizedType === 'actor' ? 80 : normalizedType === 'System' ? 300 : 140),
        height: Number(el.height) || (normalizedType === 'actor' ? 120 : normalizedType === 'System' ? 400 : 80)
      }
      
      diagramStore.elements.push(nodePayload)
    })

    // 3. CONNECTIONS RESOLUTION
    if (payload.connections && Array.isArray(payload.connections)) {
      payload.connections.forEach(conn => {
        const fromId = elementIdMapping[conn.from]
        const toId = elementIdMapping[conn.to]

        const fromNode = diagramStore.elements.find(e => String(e.id) === String(fromId))
        const toNode = diagramStore.elements.find(e => String(e.id) === String(toId))

        if (fromNode && toNode) {
          diagramStore.connections.push({
            id: crypto?.randomUUID?.() || `${Date.now()}-${Math.random().toString(36).slice(2)}`,
            from: fromNode,
            to: toNode,
            fromSide: conn.fromSide || 'right',
            toSide: conn.toSide || 'left',
            type: conn.type || 'association'
          })
        }
      })
    }

    successMessage.value = `Rendered ${diagramStore.elements.length} components and ${diagramStore.connections.length} relational vectors.`
  } catch (err) {
    errorLog.value = err.message || "Invalid JSON syntactic topology formatting rule detected."
  }
}
</script>

<style scoped>
.tab-size-2 {
  tab-size: 2;
  -moz-tab-size: 2;
}
.fade-enter-active, .fade-leave-active { transition: opacity 0.2s ease; }
.fade-enter-from, .fade-leave-to { opacity: 0; }
</style>
