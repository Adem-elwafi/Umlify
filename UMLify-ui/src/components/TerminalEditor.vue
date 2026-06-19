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

    <!-- AI Configuration Accordion Overlay -->
    <div class="mb-4 bg-[#213C51]/10 border border-[#213C51]/30 rounded-xl overflow-hidden shrink-0 transition-all">
      <!-- Accordion Toggle Header -->
      <button 
        @click="isConfigOpen = !isConfigOpen"
        class="w-full px-4 py-3 flex items-center justify-between bg-[#213C51]/20 hover:bg-[#213C51]/30 transition-colors text-left"
      >
        <div class="flex items-center space-x-2">
          <svg class="w-4 h-4 text-zinc-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          <span class="text-xs font-bold uppercase tracking-wider text-zinc-200">AI Configuration</span>
        </div>
        <div class="flex items-center space-x-2">
          <span class="text-[9px] px-2 py-0.5 bg-[#213C51]/40 border border-[#213C51]/30 rounded-md text-zinc-300 uppercase tracking-wider font-mono">
            {{ activeVendor === 'gemini' ? 'Gemini' : 'OpenAI' }}
          </span>
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
        <div v-show="isConfigOpen" class="p-4 border-t border-[#213C51]/20 bg-zinc-900/40 space-y-4">
          <!-- Vendor Selection Menu -->
          <div class="flex flex-col space-y-1.5">
            <label class="text-[10px] font-bold uppercase tracking-wider text-zinc-400">Endpoint Provider</label>
            <div class="relative">
              <select 
                v-model="activeVendor"
                class="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2 text-xs text-zinc-200 focus:outline-none focus:border-[#213C51] focus:ring-1 focus:ring-[#213C51] transition-all appearance-none cursor-pointer"
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
          <div class="flex flex-col space-y-1.5">
            <label class="text-[10px] font-bold uppercase tracking-wider text-zinc-400">API Access Token</label>
            <input 
              type="password" 
              v-model="aiApiKey"
              placeholder="Enter your API key..."
              class="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2 text-xs text-zinc-200 placeholder-zinc-700 focus:outline-none focus:border-[#213C51] focus:ring-1 focus:ring-[#213C51] transition-all"
            />
          </div>
        </div>
      </transition>
    </div>

    <!-- Tab Navigation Bar -->
    <div class="flex border-b border-zinc-900 mb-4 shrink-0">
      <button 
        @click="activeTab = 'prompt'"
        :class="[
          'flex-1 pb-2.5 text-xs font-bold uppercase tracking-wider transition-all border-b-2 text-center cursor-pointer select-none',
          activeTab === 'prompt' 
            ? 'text-zinc-200 border-[#213C51]' 
            : 'text-zinc-600 border-transparent hover:text-zinc-400'
        ]"
      >
        AI Blueprint
      </button>
      <button 
        @click="activeTab = 'json'"
        :class="[
          'flex-1 pb-2.5 text-xs font-bold uppercase tracking-wider transition-all border-b-2 text-center cursor-pointer select-none',
          activeTab === 'json' 
            ? 'text-zinc-200 border-[#213C51]' 
            : 'text-zinc-600 border-transparent hover:text-zinc-400'
        ]"
      >
        Raw JSON Sandbox
      </button>
    </div>

    <!-- Main Workspace Switcher -->
    <div class="flex-1 min-h-0 flex flex-col">
      <!-- Mode: AI Prompt Blueprint Generator -->
      <div v-if="activeTab === 'prompt'" class="flex-1 min-h-0 flex flex-col">
        <!-- Prompt Requirement Header Info -->
        <div class="mb-4 p-3 bg-zinc-900/30 border border-zinc-800/50 rounded-xl shrink-0">
          <p class="text-[10px] text-zinc-500 leading-relaxed">
            <span class="text-zinc-300 font-bold uppercase mr-1.5">Prompt Engine:</span>
            Describe your system architecture requirements in plain text. The model will securely compile layout blocks and grid connections.
          </p>
        </div>

        <!-- Requirement Prompt Buffer Textarea -->
        <div class="flex-1 min-h-0 mb-4 relative group">
          <div class="absolute inset-0 bg-gradient-to-b from-zinc-900/20 to-transparent pointer-events-none rounded-lg"></div>
          <textarea
            v-model="userRequirement"
            placeholder="e.g. Create a banking system with a Customer actor and a Teller actor. The Customer can deposit money and check balance, and the Teller can process transactions, all placed inside a Core Banking system container..."
            class="w-full h-full bg-zinc-900/50 border border-zinc-800/80 rounded-lg p-4 text-xs font-sans text-zinc-100 placeholder-zinc-700 focus:outline-none focus:border-zinc-700 focus:ring-1 focus:ring-zinc-800 transition-all shadow-inner resize-none overflow-y-auto leading-relaxed"
            spellcheck="true"
          ></textarea>
        </div>

        <!-- Inline Warning Alert Badge -->
        <div v-if="validationWarning" class="mb-4 shrink-0 bg-amber-950/20 border border-amber-900/30 p-3 rounded-lg flex items-start space-x-2 animate-pulse">
          <span class="text-amber-500 text-xs mt-0.5">⚠️</span>
          <div class="flex-1">
            <span class="text-[10px] font-bold text-amber-500 uppercase tracking-wider block">Configuration Warning</span>
            <p class="text-[11px] text-amber-400/80 leading-normal">{{ validationWarning }}</p>
          </div>
        </div>

        <!-- Telemetry Status Feedback Area -->
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
              <span class="text-[10px] font-medium text-zinc-600 font-mono">
                {{ isGenerating ? 'AI compiling and mapping vector structures...' : 'Ready for telemetry transmission...' }}
              </span>
            </div>
          </transition>
        </div>

        <!-- Action Button -->
        <button 
          @click="generateDiagramWithAI" 
          :disabled="isGenerating || !userRequirement.trim()"
          class="w-full py-2.5 bg-zinc-100 hover:bg-zinc-200 active:scale-[0.98] disabled:opacity-40 disabled:pointer-events-none text-zinc-950 font-semibold text-xs rounded-lg shadow-md transition-all flex items-center justify-center space-x-2 cursor-pointer group"
        >
          <svg 
            v-if="isGenerating" 
            class="animate-spin -ml-1 mr-3 h-4 w-4 text-zinc-950" 
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
        <div class="mb-4 p-3 bg-zinc-900/30 border border-zinc-800/50 rounded-xl shrink-0">
          <p class="text-[10px] text-zinc-500 leading-relaxed">
            <span class="text-zinc-300 font-bold uppercase mr-1.5">Blueprint Protocol:</span>
            Input a valid JSON payload containing <code class="text-zinc-300 font-mono">elements</code> and <code class="text-zinc-300 font-mono">connections</code> arrays to instantiate the vector architecture.
          </p>
        </div>

        <!-- Main Input Area Textarea -->
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

        <!-- Action Button -->
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
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue'
import axios from 'axios'
import { useDiagramStore } from '../stores/diagramStore'

const diagramStore = useDiagramStore()

// State management
const activeTab = ref('prompt')
const isConfigOpen = ref(false)
const aiApiKey = ref(localStorage.getItem('umlify_ai_key') || '')
const activeVendor = ref('gemini')
const userRequirement = ref('')
const jsonInput = ref('')
const errorLog = ref(null)
const successMessage = ref('')
const validationWarning = ref('')
const isGenerating = ref(false)

// Watcher to cache AI API key to localStorage automatically
watch(aiApiKey, (newVal) => {
  localStorage.setItem('umlify_ai_key', newVal.trim())
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

  const systemPrompt = `You are an academic software architect tool. Analyze the user's software description and output ONLY a raw, pure minified JSON object matching this structural shape exactly:
{
  "elements": [
    { "id": "unique_string_id", "type": "actor"|"usecase"|"System", "label": "String", "x": number, "y": number, "width": number, "height": number }
  ],
  "connections": [
    { "id": "unique_string_id", "from": "element_id", "to": "element_id", "fromSide": "right"|"left"|"top"|"bottom", "toSide": "right"|"left"|"top"|"bottom", "type": "association"|"include"|"extend"|"generalization"|"dependency" }
  ]
}

UML USE CASE DIAGRAM DESIGN RULES:
1. Every specific action or capability mentioned in the user requirements (e.g., "borrow books", "register members", "manage books", "search catalog") must be created as a separate "usecase" element. Do not omit any!
2. All "usecase" elements must be positioned inside the bounds of the "System" container element. For example, if the System has x: 300, y: 100, width: 300, height: 400, then all use cases must have x between 320 and 550, and y between 120 and 450.
3. "actor" elements represent users/external systems and must be placed outside the System container (e.g., to the left of the System, at x: 80).
4. "connections" must link the "actor" elements to the specific "usecase" elements they interact with. Do not link actors to the System boundary container itself.
5. Provide reasonable coordinate layouts (x, y) so elements do not overlap and the diagram is visually spaced out and readable.

CRITICAL RESTRAINT: Do not wrap your response output inside markdown code blocks (do not include \`\`\`json tags). Do not provide conversational sentences, conversational prefixes, suffixes, or pleasantries. Return only valid parseable JSON text strings.`

  try {
    let responseText = ''

    if (activeVendor.value === 'demo') {
      // Simulate network latency for a premium compiling animation feel
      await new Promise(resolve => setTimeout(resolve, 1500))
      
      responseText = JSON.stringify({
        elements: [
          { id: "customer", type: "actor", label: "Customer", x: 80, y: 160, width: 80, height: 120 },
          { id: "teller", type: "actor", label: "Bank Teller", x: 80, y: 340, width: 80, height: 120 },
          { id: "deposit", type: "usecase", label: "Deposit Funds", x: 280, y: 120, width: 140, height: 80 },
          { id: "check_bal", type: "usecase", label: "Check Balance", x: 280, y: 240, width: 140, height: 80 },
          { id: "process", type: "usecase", label: "Process Transaction", x: 280, y: 360, width: 140, height: 80 },
          { id: "core_bank", type: "System", label: "Core Banking System", x: 240, y: 60, width: 220, height: 420 }
        ],
        connections: [
          { id: "conn_1", from: "customer", to: "deposit", fromSide: "right", toSide: "left", type: "association" },
          { id: "conn_2", from: "customer", to: "check_bal", fromSide: "right", toSide: "left", type: "association" },
          { id: "conn_3", from: "teller", to: "process", fromSide: "right", toSide: "left", type: "association" }
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
    if (cleanText.startsWith('```')) {
      cleanText = cleanText.replace(/^```(?:json)?\n?/, '')
      cleanText = cleanText.replace(/\n?```$/, '')
    }
    cleanText = cleanText.trim()

    // Cache the result in raw JSON sandbox textarea for manual checks
    jsonInput.value = cleanText

    // Parse cleansed string directly into data models
    const payload = JSON.parse(cleanText)

    if (!payload.elements || !Array.isArray(payload.elements)) {
      throw new Error("Missing root 'elements' node tracking array layer.")
    }

    // 1. SAFE STATE INITIALIZATION
    diagramStore.resetDiagram()
    diagramStore.saveToHistory() // Track historical state for undo

    const elementIdMapping = {}

    // 2. COMPONENT CASING ALIGNMENT & NODE GENERATION
    payload.elements.forEach((el, index) => {
      // Create a unique ID using components' type and timestamps
      const generatedId = `${el.type?.toLowerCase() || 'node'}-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`
      
      // Map both the original element ID and the array index to the generated ID
      elementIdMapping[index] = generatedId
      if (el.id !== undefined && el.id !== null) {
        elementIdMapping[String(el.id)] = generatedId
      }

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

    // 3. CONNECTIONS RESOLUTION VIA STORE ACTIONS
    if (payload.connections && Array.isArray(payload.connections)) {
      payload.connections.forEach(conn => {
        const fromId = elementIdMapping[conn.from]
        const toId = elementIdMapping[conn.to]

        if (fromId && toId) {
          diagramStore.connectElements(
            fromId,
            toId,
            conn.fromSide || 'right',
            conn.toSide || 'left',
            conn.type || 'association'
          )
        }
      })
    }

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

    if (!payload.elements || !Array.isArray(payload.elements)) {
      throw new Error("Missing root 'elements' node tracking array layer.")
    }

    // 1. SAFE STATE INITIALIZATION
    diagramStore.resetDiagram()
    diagramStore.saveToHistory()

    // Map referencing dictionary for index matching pipelines
    const elementIdMapping = {}

    // 2. COMPONENT CASING ALIGNMENT & NODE GENERATION
    payload.elements.forEach((el, index) => {
      const generatedId = `${el.type?.toLowerCase() || 'node'}-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`
      
      elementIdMapping[index] = generatedId
      if (el.id !== undefined && el.id !== null) {
        elementIdMapping[String(el.id)] = generatedId
      }

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

    // 3. CONNECTIONS RESOLUTION VIA STORE ACTIONS
    if (payload.connections && Array.isArray(payload.connections)) {
      payload.connections.forEach(conn => {
        const fromId = elementIdMapping[conn.from]
        const toId = elementIdMapping[conn.to]

        if (fromId && toId) {
          diagramStore.connectElements(
            fromId,
            toId,
            conn.fromSide || 'right',
            conn.toSide || 'left',
            conn.type || 'association'
          )
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

