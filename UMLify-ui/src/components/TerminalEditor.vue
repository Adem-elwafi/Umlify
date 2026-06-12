<template>
  <div class="h-full flex flex-col bg-slate-950 font-mono text-sm border-l border-gray-800 text-slate-200">
    <div class="p-3 bg-slate-900 border-b border-gray-800 flex justify-between items-center shrink-0">
      <div class="flex items-center space-x-2">
        <span class="w-3 h-3 rounded-full bg-red-500"></span>
        <span class="w-3 h-3 rounded-full bg-yellow-500"></span>
        <span class="w-3 h-3 rounded-full bg-green-500"></span>
        <span class="ml-2 font-bold text-xs text-slate-400 tracking-wider uppercase">AI JSON Compiler</span>
      </div>
      <button 
        @click="compileDiagram" 
        class="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 active:scale-95 transition text-white text-xs font-semibold rounded shadow-md flex items-center space-x-1"
      >
        <span>⚡ Compile Architecture</span>
      </button>
    </div>

    <div class="p-3 bg-slate-900/50 border-b border-gray-800 text-xs text-slate-400 leading-relaxed shrink-0">
      <span class="text-indigo-400 font-semibold">ℹ️ AI Blueprint Scheme:</span>
      Ensure your payload provides an array containing an <code class="text-amber-400">elements: []</code> node collection and a <code class="text-amber-400">connections: []</code> vector line mapping.
    </div>

    <div class="flex-1 relative p-2 min-h-0">
      <textarea
        v-model="jsonInput"
        placeholder='Paste AI JSON layout pattern here... e.g.,&#10;{&#10;  "elements": [&#10;    { "type": "Actor", "label": "Student", "x": 100, "y": 150 },&#10;    { "type": "UseCase", "label": "Generate Diagram", "x": 350, "y": 140 }&#10;  ],&#10;  "connections": [&#10;    { "from": 0, "to": 1 }&#10;  ]&#10;}'
        class="w-full h-full p-4 bg-transparent text-emerald-400 placeholder-slate-600 focus:outline-none resize-none overflow-y-auto leading-relaxed tab-size-2"
        spellcheck="false"
      ></textarea>
    </div>

    <div class="shrink-0 border-t border-gray-800 bg-slate-900 max-h-40 overflow-y-auto p-3">
      <div v-if="errorLog" class="text-rose-400 bg-rose-950/40 p-2.5 rounded border border-rose-900/50 text-xs">
        <p class="font-bold mb-1">❌ Compilation Failed Matrix Error:</p>
        <p class="whitespace-pre-wrap">{{ errorLog }}</p>
      </div>
      <div v-else-if="successMessage" class="text-emerald-400 bg-emerald-950/30 p-2.5 rounded border border-emerald-900/40 text-xs flex items-center space-x-2">
        <span>✅</span>
        <span>{{ successMessage }}</span>
      </div>
      <div v-else class="text-slate-500 text-xs italic flex items-center space-x-2">
        <span>></span>
        <span>Terminal ready. Awaiting telemetry source transmission...</span>
      </div>
    </div>
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
    // Use store action to clear state and maintain history stack
    diagramStore.resetDiagram()

    // Map referencing dictionary for index matching pipelines
    const elementIdMapping = {}

    // 2. COMPONENT CASING ALIGNMENT & NODE GENERATION
    payload.elements.forEach((el, index) => {
      const generatedId = `${el.type?.toLowerCase() || 'node'}-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`
      elementIdMapping[index] = generatedId

      // Alignment mapping for Canvas.vue templates
      let normalizedType = el.type || 'usecase'
      const lowerType = String(normalizedType).toLowerCase()

      if (lowerType === 'actor') {
        normalizedType = 'actor'      // Lowercase for Actor.vue
      } else if (lowerType === 'usecase' || lowerType === 'use-case') {
        normalizedType = 'usecase'    // Lowercase for UseCase.vue
      } else if (lowerType === 'system') {
        normalizedType = 'System'     // Capitalized for System.vue
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
      
      // Direct state mutation into the reactive store array
      diagramStore.elements.push(nodePayload)
    })

    // 3. CONNECTIONS RESOLUTION USING COMPLETE OBJECT REFERENCES
    if (payload.connections && Array.isArray(payload.connections)) {
      payload.connections.forEach(conn => {
        const fromId = elementIdMapping[conn.from]
        const toId = elementIdMapping[conn.to]

        // Find the complete node reference within the newly spawned diagramStore.elements array
        // This ensures the drawing layer can compute vector positions correctly
        const fromNode = diagramStore.elements.find(e => String(e.id) === String(fromId))
        const toNode = diagramStore.elements.find(e => String(e.id) === String(toId))

        if (fromNode && toNode) {
          // Push mapped object entities using clear reactive bindings
          diagramStore.connections.push({
            id: crypto?.randomUUID?.() || `${Date.now()}-${Math.random().toString(36).slice(2)}`,
            from: fromNode, // Full object reference
            to: toNode,     // Full object reference
            fromSide: conn.fromSide || 'right',
            toSide: conn.toSide || 'left',
            type: conn.type || 'association'
          })
        }
      })
    }

    successMessage.value = `Compilation Successful! Rendered ${diagramStore.elements.length} components and ${diagramStore.connections.length} relational vectors.`
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
</style>