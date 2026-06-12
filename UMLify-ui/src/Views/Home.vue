<template>
  <div class="h-screen w-screen flex flex-col bg-[#121214] text-gray-100 select-none overflow-hidden">
    <header class="h-14 w-full bg-[#1a1a1e] border-b border-gray-800 px-6 flex justify-between items-center shrink-0 z-10">
      <div class="flex items-center space-x-3">
        <div class="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center font-bold text-white shadow-lg tracking-wider">U</div>
        <h1 class="text-base font-bold bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">UMLify Workspace</h1>
      </div>
      
      <div class="flex items-center space-x-4">
        <button 
          @click="isTerminalOpen = !isTerminalOpen"
          :class="[
            'px-4 py-1.5 rounded text-xs font-semibold tracking-wide transition-all flex items-center space-x-2 border',
            isTerminalOpen 
              ? 'bg-indigo-600/10 border-indigo-500/50 text-indigo-400 shadow-[0_0_12px_rgba(99,102,241,0.15)]' 
              : 'bg-[#26262b] border-gray-700 text-gray-300 hover:bg-[#2e2e34]'
          ]"
        >
          <span>💻</span>
          <span>{{ isTerminalOpen ? 'Hide Terminal' : 'Show AI Code Terminal' }}</span>
        </button>
      </div>
    </header>

    <main class="flex-1 w-full flex min-h-0 relative">
      <div class="flex-1 h-full relative overflow-hidden transition-all duration-300 ease-in-out">
        <Canvas />
      </div>

      <div 
        :class="[
          'h-full border-l border-gray-800/80 transition-all duration-300 ease-in-out shadow-2xl z-20 shrink-0',
          isTerminalOpen ? 'w-[32rem]' : 'w-0 pointer-events-none border-l-0 overflow-hidden'
        ]"
      >
        <TerminalEditor class="w-[32rem]" />
      </div>
    </main>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import Canvas from '../components/Canvas.vue'
import TerminalEditor from '../components/TerminalEditor.vue'

// Local state manager for the split terminal viewport toggle
const isTerminalOpen = ref(true)
</script>

<style scoped>
/* Ensure smooth calculations on layout transforms */
.transition-all {
  transition-property: all;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
  transition-duration: 300ms;
}
</style>

