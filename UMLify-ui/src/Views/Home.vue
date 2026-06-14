<template>
  <div class="h-full w-full flex flex-col bg-[#121214] text-gray-100 select-none overflow-hidden font-sans">
    <header class="h-14 w-full bg-[#1a1a1e] border-b border-gray-800 px-6 flex justify-between items-center shrink-0 z-10 shadow-md">
      <div class="flex items-center space-x-3">
        <button 
          @click="isSidebarDrawerOpen = !isSidebarDrawerOpen"
          class="p-1.5 rounded-lg bg-[#26262b] border border-gray-700 text-gray-300 hover:text-white hover:bg-gray-800 active:scale-95 transition-all mr-1"
          title="Toggle Cloud Directory Drawer"
        >
          📂 Cloud Files
        </button>

        <div class="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center font-bold text-white shadow-lg tracking-wider">U</div>
        <h1 class="text-base font-bold bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">UMLify Workspace</h1>
      </div>

      <div v-if="diagramStore.networkErrorMessage" class="px-4 py-1.5 bg-rose-950/40 border border-rose-900/50 rounded-lg text-rose-400 text-xs font-mono max-w-xl truncate">
        ⚠️ {{ diagramStore.networkErrorMessage }}
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
      <div 
        v-if="isSidebarDrawerOpen" 
        @click="isSidebarDrawerOpen = false" 
        class="absolute inset-0 bg-black/60 z-30 transition-opacity duration-300 backdrop-blur-xs" 
      />
      
      <div 
        :class="[
          'absolute left-0 top-0 bottom-0 w-80 bg-[#1a1a1e] border-r border-gray-800 z-40 transition-transform duration-300 flex flex-col shadow-2xl',
          isSidebarDrawerOpen ? 'translate-x-0' : '-translate-x-full'
        ]"
      >
        <div class="p-4 border-b border-gray-800 flex justify-between items-center bg-slate-900/40">
          <h2 class="text-xs font-bold uppercase tracking-wider text-gray-400">Cloud Projects Directory</h2>
          <button @click="isSidebarDrawerOpen = false" class="text-gray-500 hover:text-white font-semibold text-xs">✕ Close</button>
        </div>

        <div class="p-3">
          <button 
            @click="createNewCanvasAction" 
            class="w-full py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold rounded shadow transition-all active:scale-98"
          >
            ➕ New Clean Architecture Board
          </button>
        </div>

        <div class="flex-1 overflow-y-auto px-2 pb-4 space-y-1">
          <div v-if="diagramStore.savedDiagramsList.length === 0" class="text-center text-slate-500 text-xs p-8 italic">
            No cloud storage records found.
          </div>
          
          <div 
            v-for="diag in diagramStore.savedDiagramsList" 
            :key="diag.id"
            @click="handleSelectCloudDiagram(diag.id)"
            :class="[
              'p-3 rounded-lg cursor-pointer transition-all border flex items-center justify-between text-left group',
              diagramStore.currentDiagramId === diag.id 
                ? 'bg-indigo-600/10 border-indigo-500/50 text-white' 
                : 'bg-[#222227] border-gray-800/80 hover:bg-[#2a2a30] text-gray-300 hover:text-white'
            ]"
          >
            <div class="truncate mr-2">
              <p class="text-xs font-bold truncate">{{ diag.title || 'Untitled Diagram' }}</p>
              <p class="text-[10px] text-slate-500 font-mono mt-0.5">{{ new Date(diag.updatedAt || diag.createdAt).toLocaleDateString() }}</p>
            </div>
            <span class="text-xs opacity-0 group-hover:opacity-100 text-indigo-400 font-semibold transition-opacity">Load →</span>
          </div>
        </div>
      </div>

      <div class="flex-1 h-full relative overflow-hidden transition-all duration-300 ease-in-out">
        <Canvas :onLogout="handleSignOutFlow" />
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
import { ref, onMounted } from 'vue';
import { useDiagramStore } from '../stores/diagramStore';
import { useAuthStore } from '../stores/authStore';
import Canvas from '../components/Canvas.vue';
import TerminalEditor from '../components/TerminalEditor.vue';

const diagramStore = useDiagramStore();
const authStore = useAuthStore();

const isTerminalOpen = ref(true);
const isSidebarDrawerOpen = ref(false);

const handleSelectCloudDiagram = async (id) => {
  const loaded = await diagramStore.loadDiagramById(id);
  if (loaded) {
    isSidebarDrawerOpen.value = false;
  }
};

const createNewCanvasAction = () => {
  diagramStore.resetDiagram();
  isSidebarDrawerOpen.value = false;
};

const handleSignOutFlow = () => {
  diagramStore.resetDiagram();
  authStore.logout();
};

// Lifecycle trigger hook to pull user directory contents into browser layout
onMounted(async () => {
  await diagramStore.fetchUserDiagrams();
});
</script>

<style scoped>
.transition-all {
  transition-property: all;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
  transition-duration: 300ms;
}
.backdrop-blur-xs {
  backdrop-filter: blur(2px);
  -webkit-backdrop-filter: blur(2px);
}
</style>