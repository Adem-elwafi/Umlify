<template>
  <Surface
    depth="1"
    radius="none"
    :border="true"
    :customClass="[
      'w-full h-full flex flex-col font-sans border-l border-border-default bg-bg-surface overflow-hidden transition-all duration-350',
      isExpanded ? 'p-4' : 'p-0 py-4 items-center justify-between'
    ]"
  >
    <!-- Collapsed Vertical Tab Strip -->
    <template v-if="!isExpanded">
      <!-- Toggle Expand Button -->
      <button 
        @click="$emit('toggle')"
        class="p-1.5 rounded-lg hover:bg-bg-elevated text-text-secondary transition-colors cursor-pointer"
        title="Expand AI Compiler"
      >
        <ChevronLeft class="w-4 h-4" />
      </button>

      <!-- Rotated Text Label -->
      <div 
        class="text-[9px] font-bold uppercase tracking-widest text-text-secondary font-mono select-none whitespace-nowrap"
        style="writing-mode: vertical-rl; transform: rotate(180deg);"
      >
        AI Architecture Compiler
      </div>

      <!-- Pulse Status Indicator -->
      <div class="flex items-center justify-center">
        <span 
          class="w-2 h-2 rounded-full" 
          :class="isGenerating ? 'bg-warning animate-pulse' : successMessage ? 'bg-success' : 'bg-text-muted'"
          :title="isGenerating ? 'Compiling' : successMessage ? 'Active' : 'Standby'"
        ></span>
      </div>
    </template>

    <!-- Expanded Full Editor Content -->
    <template v-else>
      <!-- Panel Header -->
      <div class="flex items-center justify-between mb-4 shrink-0">
        <div class="flex items-center space-x-3">
          <div class="flex space-x-1.5">
            <span class="w-2.5 h-2.5 rounded-full bg-rose-500/80 dark:bg-rose-500/60"></span>
            <span class="w-2.5 h-2.5 rounded-full bg-amber-500/80 dark:bg-amber-500/60"></span>
            <span class="w-2.5 h-2.5 rounded-full bg-emerald-500/80 dark:bg-emerald-500/60"></span>
          </div>
          <h2 class="text-[10px] font-bold tracking-wider uppercase text-zinc-600 dark:text-zinc-400 select-none font-mono">
            AI Architecture Compiler
          </h2>
        </div>
        <div class="flex items-center space-x-2">
          <Badge :variant="isGenerating ? 'warning' : successMessage ? 'success' : 'neutral'" customClass="text-[9px] px-2 py-0.5">
            <template #left>
              <span class="w-1.5 h-1.5 rounded-full" :class="isGenerating ? 'bg-warning animate-pulse' : successMessage ? 'bg-success' : 'bg-text-muted'"></span>
            </template>
            {{ isGenerating ? 'Compiling' : successMessage ? 'Active' : 'Standby' }}
          </Badge>
          
          <!-- Collapse Button -->
          <button 
            @click="$emit('toggle')"
            class="p-1 rounded hover:bg-bg-elevated text-text-secondary cursor-pointer"
            title="Collapse AI Compiler"
          >
            <ChevronRight class="w-4 h-4" />
          </button>
        </div>
      </div>

      <!-- AI Configuration Accordion Overlay -->
      <div class="mb-4 bg-zinc-200/20 border border-zinc-300/40 dark:bg-zinc-800/10 dark:border-zinc-700/30 rounded-xl overflow-hidden shrink-0 transition-all">
        <!-- Accordion Toggle Header -->
        <button 
          @click="isConfigOpen = !isConfigOpen"
          class="w-full px-4 py-3 flex items-center justify-between bg-zinc-200/35 hover:bg-zinc-200/50 dark:bg-zinc-800/20 dark:hover:bg-zinc-800/30 transition-colors text-left"
        >
          <div class="flex items-center space-x-2">
            <svg class="w-4 h-4 text-zinc-650 dark:text-zinc-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            <span class="text-xs font-bold uppercase tracking-wider text-zinc-750 dark:text-zinc-200">AI Configuration</span>
          </div>
          <div class="flex items-center space-x-2">
            <Badge variant="neutral" customClass="uppercase tracking-wider font-mono text-[9px] px-2 py-0.5">
              {{ activeVendor === 'gemini' ? 'Gemini' : activeVendor === 'openai' ? 'OpenAI' : activeVendor === 'groq' ? 'Groq' : activeVendor === 'openrouter' ? 'OpenRouter' : 'Demo' }}
            </Badge>
            <svg 
              class="w-4 h-4 text-zinc-400 transition-transform duration-200" 
              :class="isConfigOpen ? 'rotate-180' : ''"
              fill="none" stroke="currentColor" viewBox="0 0 24 24"
            >
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
            </svg>
          </div>
        </button>

        <!-- Accordion Content -->
        <transition name="expand">
          <div v-show="isConfigOpen" class="p-4 border-t border-zinc-200 dark:border-zinc-800/40 bg-zinc-100/30 dark:bg-zinc-900/40 space-y-4">
            <!-- Vendor Selection Menu -->
            <div class="flex flex-col space-y-1.5">
              <label class="text-[10px] font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">Endpoint Provider</label>
              <div class="relative">
                <select 
                  v-model="activeVendor"
                  class="w-full bg-white border border-zinc-200 dark:bg-zinc-950 dark:border-zinc-800 rounded-lg px-3 py-2 text-xs text-zinc-800 dark:text-zinc-200 focus:outline-none focus:border-zinc-400 focus:ring-1 focus:ring-zinc-400 dark:focus:border-zinc-650 dark:focus:ring-zinc-650 transition-all appearance-none cursor-pointer"
                >
                  <option value="gemini">Google Gemini API</option>
                  <option value="openai">OpenAI Completion API</option>
                  <option value="groq">Groq Cloud API (Free Tier)</option>
                  <option value="openrouter">OpenRouter API (Free Tier)</option>
                  <option value="demo">Local Demo (No Key Required)</option>
                </select>
                <div class="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-zinc-500">
                  <svg class="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                    <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/>
                  </svg>
                </div>
              </div>
            </div>

            <!-- API Key Input Field -->
            <div v-if="activeVendor !== 'demo'" class="flex flex-col space-y-1.5">
              <Input
                v-if="activeVendor !== 'demo'"
                type="password"
                v-model="aiApiKey"
                label="API Access Token"
                placeholder="Enter your API key..."
                customClass="h-9 px-3 py-1.5 text-xs text-text-primary border border-border-default rounded-interactive focus-visible:ring-interactive-accent"
              />
            </div>
          </div>
        </transition>
      </div>

      <!-- Tab Navigation Bar -->
      <div class="flex border-b border-zinc-200 dark:border-zinc-850 mb-4 shrink-0">
        <button 
          @click="activeTab = 'prompt'"
          :class="[
            'flex-1 pb-2.5 text-xs font-bold uppercase tracking-wider transition-all border-b-2 text-center cursor-pointer select-none',
            activeTab === 'prompt' 
              ? 'text-zinc-850 border-zinc-800 dark:text-zinc-200 dark:border-zinc-300' 
              : 'text-zinc-400 border-transparent hover:text-zinc-600 dark:text-zinc-500 dark:hover:text-zinc-350'
          ]"
        >
          AI Blueprint
        </button>
        <button 
          @click="activeTab = 'json'"
          :class="[
            'flex-1 pb-2.5 text-xs font-bold uppercase tracking-wider transition-all border-b-2 text-center cursor-pointer select-none',
            activeTab === 'json' 
              ? 'text-zinc-850 border-zinc-800 dark:text-zinc-200 dark:border-zinc-300' 
              : 'text-zinc-400 border-transparent hover:text-zinc-600 dark:text-zinc-500 dark:hover:text-zinc-350'
          ]"
        >
          Raw JSON Sandbox
        </button>
      </div>

      <!-- Main Workspace Switcher -->
      <div class="flex-1 min-h-0 flex flex-col animate-fade-in">
        <!-- Mode: AI Prompt Blueprint Generator -->
        <div v-if="activeTab === 'prompt'" class="flex-1 min-h-0 flex flex-col">
          <!-- Prompt Requirement Header Info -->
          <div class="mb-4 p-3 bg-zinc-200/40 border border-zinc-350/40 dark:bg-zinc-900/30 dark:border-zinc-800/50 rounded-xl shrink-0">
            <p class="text-[10px] text-zinc-600 dark:text-zinc-400 leading-relaxed">
              <span class="text-zinc-800 dark:text-zinc-200 font-bold uppercase mr-1.5">Prompt Engine:</span>
              Describe your system architecture requirements in plain text. The model will securely compile layout blocks and grid connections.
            </p>
          </div>

          <!-- Requirement Prompt Buffer Textarea -->
          <div class="flex-1 min-h-0 mb-4 relative group">
            <Textarea
              v-model="userRequirement"
              placeholder="e.g. Create a banking system with a Customer actor and a Teller actor. The Customer can deposit money and check balance, and the Teller can process transactions, all placed inside a Core Banking system container..."
              customClass="h-full border border-border-default rounded-interactive focus-visible:ring-interactive-accent resize-none overflow-y-auto"
            />
            <div class="absolute bottom-3 right-3 text-[10px] font-mono text-text-muted bg-bg-surface/80 px-1.5 py-0.5 rounded border border-border-default select-none z-10">
              {{ userRequirement.length }} / 2000
            </div>
          </div>

          <!-- Action Button -->
          <button 
            @click="generateDiagramWithAI" 
            :disabled="isGenerating || !userRequirement.trim()"
            class="w-full py-2.5 bg-zinc-900 text-white hover:bg-zinc-800 dark:bg-zinc-100 dark:text-zinc-950 dark:hover:bg-zinc-200 active:scale-[0.98] disabled:opacity-40 disabled:pointer-events-none font-semibold text-xs rounded-lg shadow-md transition-all flex items-center justify-center space-x-2 cursor-pointer group shrink-0"
          >
            <svg 
              v-if="isGenerating" 
              class="animate-spin -ml-1 mr-3 h-4 w-4 text-white dark:text-zinc-950" 
              xmlns="http://www.w3.org/2000/svg" 
              fill="none" 
              viewBox="0 0 24 24"
            >
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <svg v-else class="w-3.5 h-3.5 group-hover:rotate-12 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
            <span>{{ isGenerating ? 'Synthesizing Architecture...' : 'Generate Architecture Blueprint' }}</span>
          </button>
        </div>

        <!-- Mode: Raw JSON Sandbox -->
        <div v-else class="flex-1 min-h-0 flex flex-col">
          <!-- Blueprint Protocol Info -->
          <div class="mb-4 p-3 bg-zinc-200/40 border border-zinc-350/40 dark:bg-zinc-900/30 dark:border-zinc-800/50 rounded-xl shrink-0">
            <p class="text-[10px] text-zinc-600 dark:text-zinc-400 leading-relaxed">
              <span class="text-zinc-800 dark:text-zinc-200 font-bold uppercase mr-1.5">Blueprint Protocol:</span>
              Input a valid JSON payload containing <code class="text-zinc-800 dark:text-zinc-200 font-mono font-bold">elements</code> and <code class="text-zinc-800 dark:text-zinc-200 font-mono font-bold">connections</code> arrays to instantiate the vector architecture.
            </p>
          </div>

          <!-- Main Input Area Textarea -->
          <div class="flex-1 min-h-0 mb-4 relative group">
            <Textarea
              v-model="jsonInput"
              placeholder='{&#10;  "elements": [...],&#10;  "connections": [...]&#10;}'
              customClass="h-full font-mono text-xs border border-border-default rounded-interactive focus-visible:ring-interactive-accent resize-none overflow-y-auto"
            />
          </div>

          <!-- Action Button -->
          <button 
            @click="compileDiagram" 
            :disabled="!jsonInput.trim()"
            class="w-full py-2.5 bg-zinc-900 text-white hover:bg-zinc-800 dark:bg-zinc-100 dark:text-zinc-950 dark:hover:bg-zinc-200 active:scale-[0.98] disabled:opacity-40 disabled:pointer-events-none font-semibold text-xs rounded-lg shadow-md transition-all flex items-center justify-center space-x-2 cursor-pointer group shrink-0"
          >
            <svg class="w-3.5 h-3.5 group-hover:rotate-12 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
            <span>Compile Architecture</span>
          </button>
        </div>
      </div>
    </template>
  </Surface>
</template>

<script setup>
import { ref, watch } from 'vue'
import axios from 'axios'
import { useDiagramStore } from '../stores/diagramStore'
import Surface from './ui/layout/Surface.vue'
import Input from './ui/Input.vue'
import Textarea from './ui/Textarea.vue'
import Badge from './ui/Badge.vue'
import { ChevronLeft, ChevronRight } from 'lucide-vue-next'
import { layoutUseCaseDiagram } from '../utils/useCaseLayout'

defineProps({
  isExpanded: {
    type: Boolean,
    default: true
  }
})

defineEmits(['toggle'])

const diagramStore = useDiagramStore()

// State management
const activeTab = ref('prompt')
const isConfigOpen = ref(localStorage.getItem('umlify_terminal_config_open') === 'true')
const aiApiKey = ref(localStorage.getItem('umlify_ai_key') || '')
const activeVendor = ref(localStorage.getItem('umlify_active_vendor') || 'gemini')
const userRequirement = ref('')
const jsonInput = ref('')
const errorLog = ref(null)
const successMessage = ref('')
const validationWarning = ref('')
const isGenerating = ref(false)

// Synchronize compile state to global status bar in diagramStore
watch(validationWarning, (newVal) => {
  if (newVal) {
    diagramStore.setCompilerState({ warning: newVal, status: 'warning' });
  } else if (!isGenerating.value && !errorLog.value && !successMessage.value) {
    diagramStore.setCompilerState({ warning: null, status: 'idle' });
  } else {
    diagramStore.setCompilerState({ warning: null });
  }
});

watch(errorLog, (newVal) => {
  if (newVal) {
    diagramStore.setCompilerState({ error: newVal, status: 'error', message: newVal });
  } else if (!isGenerating.value && !successMessage.value && !validationWarning.value) {
    diagramStore.setCompilerState({ error: null, status: 'idle', message: 'Ready for telemetry transmission...' });
  } else {
    diagramStore.setCompilerState({ error: null });
  }
});

watch(successMessage, (newVal) => {
  if (newVal) {
    diagramStore.setCompilerState({ status: 'success', message: newVal });
  }
});

watch(isGenerating, (newVal) => {
  if (newVal) {
    diagramStore.setCompilerState({ status: 'compiling', message: 'AI compiling and mapping vector structures...' });
  } else {
    if (errorLog.value) {
      diagramStore.setCompilerState({ status: 'error', message: errorLog.value });
    } else if (successMessage.value) {
      diagramStore.setCompilerState({ status: 'success', message: successMessage.value });
    } else if (validationWarning.value) {
      diagramStore.setCompilerState({ status: 'warning' });
    } else {
      diagramStore.setCompilerState({ status: 'idle', message: 'Ready for telemetry transmission...' });
    }
  }
});

// Watcher to cache AI API key to localStorage automatically
watch(aiApiKey, (newVal) => {
  localStorage.setItem('umlify_ai_key', newVal.trim())
})

// Watcher to cache active vendor choice automatically
watch(activeVendor, (newVal) => {
  localStorage.setItem('umlify_active_vendor', newVal)
})

// Watcher to cache config accordion open state automatically
watch(isConfigOpen, (newVal) => {
  localStorage.setItem('umlify_terminal_config_open', String(newVal))
})

// Clear validation alert/feedback states on tab switch
watch(activeTab, () => {
  validationWarning.value = ''
  errorLog.value = null
  successMessage.value = ''
})

// Validation Alert Clear helper
watch([aiApiKey, userRequirement], () => {
  if (aiApiKey.value.trim() && userRequirement.value.trim()) {
    validationWarning.value = ''
  }
})

// -------------------------------------------------------------------------
// METHOD: Client-Side Autonomous AI Blueprint Generation
// -------------------------------------------------------------------------
const generateDiagramWithAI = async () => {
  // Clear feedback states
  validationWarning.value = ''
  errorLog.value = null
  successMessage.value = ''

  // Validation Guardrails
  if (activeVendor.value !== 'demo' && !aiApiKey.value.trim()) {
    validationWarning.value = 'API Access Key is missing. Open the AI Configuration accordion above and provide your key.'
    return
  }
  if (!userRequirement.value.trim()) {
    validationWarning.value = 'User requirements prompt buffer is empty. Please describe the architecture to compile.'
    return
  }

  isGenerating.value = true

  const systemPrompt = `You are an academic software architect tool. Analyze the user's software description and output ONLY a raw, pure minified JSON object describing the SEMANTICS of a Use Case diagram. You must NOT output any coordinates (x/y/width/height) or connection sides (fromSide/toSide) — those are computed deterministically by a layout engine after you respond.

Output ONLY this exact structural shape:
{
  "actors": [
    { "id": "unique_string_id", "label": "String" }
  ],
  "system": { "id": "unique_string_id", "label": "String" },
  "useCases": [
    { "id": "unique_string_id", "label": "String" }
  ],
  "connections": [
    { "from": "element_id", "to": "element_id", "type": "association"|"include"|"extend"|"generalization"|"dependency" }
  ]
}

UML USE CASE DIAGRAM SEMANTIC RULES:
1. Every specific action or capability mentioned in the user requirements (e.g., "borrow books", "register members", "manage books", "search catalog") must be created as a separate entry in "useCases". Do not omit any!
2. "actors" represent users/external systems that interact with the system.
3. "system" is the single container boundary that groups the use cases.
4. "connections" must link the "actor" ids to the specific "usecase" ids they interact with (type "association" or "dependency"), or link "usecase" ids to each other using "include"/"extend"/"generalization" when one use case relates to another. Do NOT connect actors to the system boundary.
5. Reference elements only by the exact "id" values you defined in actors/useCases/system.

CRITICAL RESTRAINT: Do not wrap your response output inside markdown code blocks (do not include \`\`\`json tags). Do not provide conversational sentences, conversational prefixes, suffixes, or pleasantries. Return only valid parseable JSON text strings.`

  try {
    let responseText = ''

    if (activeVendor.value === 'demo') {
      // Simulate network latency for a premium compiling animation feel
      await new Promise(resolve => setTimeout(resolve, 1500))
      
      responseText = JSON.stringify({
        actors: [
          { id: "customer", label: "Customer" },
          { id: "teller", label: "Bank Teller" }
        ],
        system: { id: "core_bank", label: "Core Banking System" },
        useCases: [
          { id: "deposit", label: "Deposit Funds" },
          { id: "check_bal", label: "Check Balance" },
          { id: "process", label: "Process Transaction" }
        ],
        connections: [
          { from: "customer", to: "deposit", type: "association" },
          { from: "customer", to: "check_bal", type: "association" },
          { from: "teller", to: "process", type: "association" }
        ]
      }, null, 2)
    } else if (activeVendor.value === 'gemini') {
      let res
      const apiKeyTrimmed = aiApiKey.value.trim()
      const modelsToTry = [
        'gemini-2.0-flash',
        'gemini-2.5-flash',
        'gemini-3.5-flash',
        'gemini-flash-latest',
        'gemini-1.5-flash'
      ]

      let lastErr = null
      for (const modelName of modelsToTry) {
        try {
          // Try the stable v1 path first
          const geminiUrl = `https://generativelanguage.googleapis.com/v1/models/${modelName}:generateContent?key=${apiKeyTrimmed}`
          res = await axios.post(geminiUrl, {
            contents: [
              {
                parts: [
                  {
                    text: `${systemPrompt}\n\nUser Software Description:\n${userRequirement.value}`
                  }
                ]
              }
            ]
          })
          break // Found a supported model, break loop
        } catch (err) {
          lastErr = err
          // If the model or endpoint is Not Found, try v1beta fallback for this model
          if (err.response?.status === 404) {
            try {
              const fallbackUrl = `https://generativelanguage.googleapis.com/v1beta/models/${modelName}:generateContent?key=${apiKeyTrimmed}`
              res = await axios.post(fallbackUrl, {
                contents: [
                  {
                    parts: [
                      {
                        text: `${systemPrompt}\n\nUser Software Description:\n${userRequirement.value}`
                      }
                    ]
                  }
                ]
              })
              break // Found a supported model on v1beta, break loop
            } catch (betaErr) {
              lastErr = betaErr
              if (betaErr.response?.status === 404) {
                // Continue to the next model in sequence
                continue
              } else {
                throw betaErr
              }
            }
          } else {
            throw err
          }
        }
      }

      if (!res) {
        throw lastErr || new Error('No compatible Gemini models could be contacted.')
      }

      const rawText = res.data?.candidates?.[0]?.content?.parts?.[0]?.text
      if (!rawText) {
        throw new Error('Received an empty response payload from Google Gemini API.')
      }
      responseText = rawText
    } else if (activeVendor.value === 'openai') {
      // OpenAI Protocol
      const openaiUrl = 'https://api.openai.com/v1/chat/completions'
      
      const res = await axios.post(openaiUrl, {
        model: 'gpt-4o-mini',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userRequirement.value }
        ]
      }, {
        headers: {
          'Authorization': `Bearer ${aiApiKey.value.trim()}`,
          'Content-Type': 'application/json'
        }
      })

      const rawText = res.data?.choices?.[0]?.message?.content
      if (!rawText) {
        throw new Error('Received an empty response payload from OpenAI API.')
      }
      responseText = rawText
    } else if (activeVendor.value === 'groq') {
      // Groq Protocol
      const groqUrl = 'https://api.groq.com/openai/v1/chat/completions'
      let res

      try {
        // Try Llama 3.3 70B first
        res = await axios.post(groqUrl, {
          model: 'llama-3.3-70b-versatile',
          messages: [
            { role: 'system', content: systemPrompt },
            { role: 'user', content: userRequirement.value }
          ]
        }, {
          headers: {
            'Authorization': `Bearer ${aiApiKey.value.trim()}`,
            'Content-Type': 'application/json'
          }
        })
      } catch (err) {
        if (err.response?.status === 400) {
          // Fallback to Llama 3.1 8B
          res = await axios.post(groqUrl, {
            model: 'llama-3.1-8b-instant',
            messages: [
              { role: 'system', content: systemPrompt },
              { role: 'user', content: userRequirement.value }
            ]
          }, {
            headers: {
              'Authorization': `Bearer ${aiApiKey.value.trim()}`,
              'Content-Type': 'application/json'
            }
          })
        } else {
          throw err
        }
      }

      const rawText = res.data?.choices?.[0]?.message?.content
      if (!rawText) {
        throw new Error('Received an empty response payload from Groq API.')
      }
      responseText = rawText
    } else if (activeVendor.value === 'openrouter') {
      // OpenRouter Protocol
      const openrouterUrl = 'https://openrouter.ai/api/v1/chat/completions'
      let res

      try {
        // Try Llama 3.3 70B Instruct (Free) first
        res = await axios.post(openrouterUrl, {
          model: 'meta-llama/llama-3.3-70b-instruct:free',
          messages: [
            { role: 'system', content: systemPrompt },
            { role: 'user', content: userRequirement.value }
          ]
        }, {
          headers: {
            'Authorization': `Bearer ${aiApiKey.value.trim()}`,
            'Content-Type': 'application/json',
            'HTTP-Referer': window.location.origin || 'http://localhost:5173',
            'X-Title': 'UMLify'
          }
        })
      } catch (err) {
        if (err.response?.status === 404) {
          // Fallback to Llama 3.2 3B Instruct (Free)
          res = await axios.post(openrouterUrl, {
            model: 'meta-llama/llama-3.2-3b-instruct:free',
            messages: [
              { role: 'system', content: systemPrompt },
              { role: 'user', content: userRequirement.value }
            ]
          }, {
            headers: {
              'Authorization': `Bearer ${aiApiKey.value.trim()}`,
              'Content-Type': 'application/json',
              'HTTP-Referer': window.location.origin || 'http://localhost:5173',
              'X-Title': 'UMLify'
            }
          })
        } else {
          throw err
        }
      }

      const rawText = res.data?.choices?.[0]?.message?.content
      if (!rawText) {
        throw new Error('Received an empty response payload from OpenRouter API.')
      }
      responseText = rawText
    }

    // Telemetry Cleanup Layer
    let cleanText = responseText.trim()
    
    // Try to locate JSON content between markdown backticks or within text
    const jsonBlockRegex = /```(?:json)?\s*(\{[\s\S]*?\})\s*```/i
    const match = cleanText.match(jsonBlockRegex)
    if (match && match[1]) {
      cleanText = match[1]
    } else {
      // If no backticks, try to extract anything between the first '{' and last '}'
      const firstBrace = cleanText.indexOf('{')
      const lastBrace = cleanText.lastIndexOf('}')
      if (firstBrace !== -1 && lastBrace !== -1 && lastBrace > firstBrace) {
        cleanText = cleanText.slice(firstBrace, lastBrace + 1)
      }
    }
    cleanText = cleanText.trim()

    // Cache the result in raw JSON sandbox textarea for manual checks
    jsonInput.value = cleanText

    // Parse cleansed string directly into data models. AI-generated
    // payloads MUST be the semantic shape; any schema deviation throws
    // and is reported below as a generation error (not silently accepted).
    const payload = JSON.parse(cleanText)
    applyPayload(payload, 'semantic')

    successMessage.value = `AI compiled successfully! Loaded ${diagramStore.elements.length} components and ${diagramStore.connections.length} relational vectors.`
  } catch (err) {
    console.error(err)
    if (err.response?.status === 429) {
      errorLog.value = 'Rate limit exceeded (HTTP 429). The provided API Key has exhausted its quota or free-tier limit. Please check your plan and billing details in your provider console (e.g., Google AI Studio) or try again later.'
    } else if (err.response?.data?.error?.message) {
      errorLog.value = `API error: ${err.response.data.error.message}`
    } else {
      errorLog.value = err.message || 'Unknown compilation error during hydration.'
    }
  } finally {
    isGenerating.value = false
  }
}

// -------------------------------------------------------------------------
// METHOD: Apply Compiled Payload to Diagram Store
// -------------------------------------------------------------------------
// The routing decision is made by CALL ORIGIN, never by inspecting which
// keys happen to be present in the payload:
//   - mode 'semantic' (AI generation path): payload MUST be the new
//     coordinate-free schema. If it isn't, we throw a generation error so
//     the failure is reported/retried instead of silently producing a bad,
//     possibly-overlapping diagram.
//   - mode 'legacy' (manual JSON-compile path): allows the old raw
//     elements[] + connections[] shape with explicit x/y/side coordinates.
const applyPayload = (payload, mode = 'semantic') => {
  if (mode === 'legacy') {
    // Manual compile path: shape-detection is acceptable here because
    // the input is user-typed, not an untrusted AI response. If the
    // payload has the semantic shape (actors/system/useCases/connections),
    // run it through the layout engine; otherwise fall back to the legacy
    // raw elements[] path.
    const isSemantic =
      payload &&
      typeof payload === 'object' &&
      !Array.isArray(payload) &&
      Array.isArray(payload.actors) &&
      payload.system &&
      typeof payload.system === 'object' &&
      Array.isArray(payload.useCases) &&
      Array.isArray(payload.connections)

    if (isSemantic) {
      const { elements, connections } = layoutUseCaseDiagram(payload)
      hydrateStore(elements, connections)
    } else {
      const elements = (payload && Array.isArray(payload.elements)) ? payload.elements : []
      const connections = (payload && Array.isArray(payload.connections)) ? payload.connections : []
      hydrateStore(elements, connections)
    }
    return
  }

  // Semantic path: validate the schema strictly before trusting it.
  const validated = validateSemanticPayload(payload)
  const { elements, connections } = layoutUseCaseDiagram(validated)
  hydrateStore(elements, connections)
}

// Strict validation of the AI semantic payload. Throws on any deviation
// from the agreed contract (the LLM must NOT emit x/y/width/height or
// fromSide/toSide, and must provide the expected arrays/strings).
const validateSemanticPayload = (payload) => {
  if (!payload || typeof payload !== 'object' || Array.isArray(payload)) {
    throw new Error("AI response is not the expected semantic Use Case payload object.")
  }
  if (!Array.isArray(payload.actors) || !Array.isArray(payload.useCases) || !Array.isArray(payload.connections)) {
    throw new Error("AI response is missing required semantic arrays (actors/useCases/connections). The model may have reverted to emitting raw coordinates.")
  }
  if (!payload.system || typeof payload.system !== 'object' || typeof payload.system.id !== 'string') {
    throw new Error("AI response is missing a valid 'system' object.")
  }
  const looksLikeRawElements = Array.isArray(payload.elements)
  const hasRawCoordinates = [...payload.actors, ...payload.useCases].some(
    (item) => item && ('x' in item || 'y' in item || 'width' in item || 'height' in item || 'type' in item)
  )
  if (looksLikeRawElements || hasRawCoordinates) {
    throw new Error("AI response contains coordinates/raw element shapes. The model ignored the semantic-only system prompt.")
  }
  const validTypes = ['association', 'include', 'extend', 'generalization', 'dependency']
  const knownIds = new Set([
    ...payload.actors.map((a) => a?.id),
    payload.system.id,
    ...payload.useCases.map((u) => u?.id)
  ].filter((id) => typeof id === 'string'))
  payload.connections.forEach((conn) => {
    if (!conn || typeof conn.from !== 'string' || typeof conn.to !== 'string' || typeof conn.type !== 'string') {
      throw new Error("AI response has a malformed connection (requires from/to/type strings).")
    }
    if (!validTypes.includes(conn.type)) {
      throw new Error(`AI response has a connection with an invalid type '${conn.type}'. Allowed: ${validTypes.join('|')}.`)
    }
    if (!knownIds.has(conn.from) || !knownIds.has(conn.to)) {
      throw new Error(`AI response references an unknown element id in a connection ('${conn.from}' -> '${conn.to}'). All connection endpoints must reference a defined actor/system/useCase id.`)
    }
  })
  return payload
}

// Hydrate the diagram store from positioned elements + connections.
// Connections are matched to elements by stable semantic id.
const hydrateStore = (elements, connections) => {
  // 1. SAFE STATE INITIALIZATION
  diagramStore.resetDiagram()
  diagramStore.saveToHistory()

  // 2. NODE GENERATION (positions already computed by the layout engine)
  elements.forEach((el) => {
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
      id: el.id,
      type: normalizedType,
      label: el.label || 'Default Node',
      x: Number(el.x) || 100,
      y: Number(el.y) || 100,
      width: Number(el.width) || 140,
      height: Number(el.height) || 80
    }

    diagramStore.addElement(nodePayload)
  })

  // 3. CONNECTIONS RESOLUTION VIA STORE ACTIONS
  connections.forEach((conn) => {
    if (conn.from && conn.to) {
      diagramStore.connectElements(
        conn.from,
        conn.to,
        conn.fromSide || 'right',
        conn.toSide || 'left',
        conn.type || 'association'
      )
    }
  })
}

// -------------------------------------------------------------------------
// METHOD: Manual JSON Blueprint Compilation
// -------------------------------------------------------------------------
const compileDiagram = () => {
  // Reset logs
  errorLog.value = null
  successMessage.value = ''
  validationWarning.value = ''

  if (!jsonInput.value.trim()) {
    errorLog.value = "Input stream buffer is empty. Paste an AI generated payload first."
    return
  }

  try {
    const payload = JSON.parse(jsonInput.value)
    applyPayload(payload, 'legacy')
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

.expand-enter-active, .expand-leave-active {
  transition: all 0.3s ease-in-out;
  max-height: 250px;
  opacity: 1;
  overflow: hidden;
}
.expand-enter-from, .expand-leave-to {
  max-height: 0;
  opacity: 0;
  padding-top: 0;
  padding-bottom: 0;
  margin-top: 0;
  margin-bottom: 0;
}
</style>

