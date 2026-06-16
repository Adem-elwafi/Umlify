<template>
  <div class="h-full w-full flex flex-col bg-zinc-50 select-none overflow-hidden font-sans">
    <!-- Master Workspace Header -->
    <header class="h-14 w-full bg-white border-b border-zinc-200/80 px-6 flex justify-between items-center shrink-0 z-30 shadow-xs">
      <div class="flex items-center gap-4">
        <button 
          @click="isSidebarDrawerOpen = !isSidebarDrawerOpen"
          class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-zinc-50 hover:bg-zinc-100 border border-zinc-200 text-zinc-700 text-xs font-medium transition-all active:scale-95 cursor-pointer shadow-xs select-none"
          title="Toggle Cloud Directory Drawer"
        >
          <span>📂</span>
          <span>Cloud Files</span>
        </button>

        <div class="flex items-center gap-2">
          <div class="w-6 h-6 rounded bg-zinc-900 flex items-center justify-center font-bold text-white text-xs select-none">U</div>
          <h1 class="text-sm font-semibold tracking-tight text-zinc-900 select-none font-sans">UMLify Workspace</h1>
        </div>
      </div>

      <div v-if="diagramStore.networkErrorMessage" class="px-4 py-1.5 bg-rose-50 border border-rose-100 rounded-lg text-rose-600 text-[10px] font-mono max-w-xl truncate">
        ⚠️ {{ diagramStore.networkErrorMessage }}
      </div>
      
      <div class="flex items-center">
        <button 
          @click="isTerminalOpen = !isTerminalOpen"
          :class="isTerminalOpen 
            ? 'inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-zinc-900 text-white text-xs font-medium transition-all cursor-pointer shadow-sm select-none' 
            : 'inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-zinc-50 hover:bg-zinc-100 border border-zinc-200 text-zinc-700 text-xs font-medium transition-all active:scale-95 cursor-pointer shadow-xs select-none'"
        >
          <span>💻</span>
          <span>{{ isTerminalOpen ? 'Hide Terminal' : 'AI Terminal' }}</span>
        </button>
      </div>
    </header>

    <main class="flex-1 w-full flex min-h-0 relative">
      <!-- Cloud File Drawer Backdrop -->
      <transition name="fade">
        <div 
          v-if="isSidebarDrawerOpen" 
          @click="isSidebarDrawerOpen = false" 
          class="absolute inset-0 bg-zinc-950/20 z-40 transition-opacity duration-200 backdrop-blur-xs" 
        />
      </transition>
      
      <!-- Collapsible Cloud File Slider Drawer -->
      <div 
        :class="[
          'absolute left-0 top-0 bottom-0 w-80 bg-white border-r border-zinc-200 z-50 transition-transform duration-300 ease-in-out flex flex-col shadow-2xl',
          isSidebarDrawerOpen ? 'translate-x-0' : '-translate-x-full'
        ]"
      >
        <div class="p-4 border-b border-zinc-100 flex justify-between items-center bg-zinc-50/50 text-[11px] font-bold uppercase tracking-wider text-zinc-400 select-none">
          <span>Cloud Projects Directory</span>
          <button @click="isSidebarDrawerOpen = false" class="text-zinc-400 hover:text-zinc-600 transition-colors cursor-pointer">✕</button>
        </div>

        <div class="p-4">
          <button 
            @click="createNewCanvasAction" 
            class="w-full py-2 bg-zinc-900 hover:bg-zinc-800 text-white text-xs font-semibold rounded-lg shadow-sm transition-all active:scale-98 cursor-pointer text-center"
          >
            New Clean Canvas
          </button>
        </div>

        <div class="flex-1 overflow-y-auto px-2 pb-4 space-y-1">
          <div v-if="diagramStore.savedDiagramsList.length === 0" class="text-center text-zinc-400 text-[11px] p-8 italic font-mono">
            No cloud storage records found.
          </div>
          
          <!-- Saved Diagram Database Rows -->
          <div 
            v-for="diag in diagramStore.savedDiagramsList" 
            :key="diag.id"
            @click="handleSelectCloudDiagram(diag.id)"
            :class="[
              'p-3 mx-2 rounded-xl transition-all cursor-pointer select-none group flex items-center justify-between',
              diagramStore.currentDiagramId === diag.id 
                ? 'bg-blue-50/40 border border-blue-200/60 text-blue-900' 
                : 'bg-transparent border border-transparent hover:bg-zinc-50/80 text-zinc-700 hover:text-zinc-900'
            ]"
          >
            <div class="truncate mr-2">
              <p class="text-xs font-semibold truncate">{{ diag.title || 'Untitled Diagram' }}</p>
              <p class="text-[10px] text-zinc-400 font-mono tracking-normal mt-0.5">
                {{ new Date(diag.updatedAt || diag.createdAt).toLocaleDateString() }}
              </p>
            </div>
            <span class="text-[10px] opacity-0 group-hover:opacity-100 text-zinc-400 font-bold tracking-tighter transition-all translate-x-1 group-hover:translate-x-0">LOAD</span>
          </div>
        </div>
      </div>

      <!-- Main Drawing Area Container -->
      <div class="flex-1 h-full relative bg-[radial-gradient(#e4e4e7_1px,transparent_1px)] [background-size:16px_16px] bg-zinc-50 transition-all duration-300 overflow-hidden">
        <Canvas :onLogout="handleSignOutFlow" />
      </div>

      <!-- AI Terminal Pane Layout Wrapper -->
      <div 
        :class="[
          'h-full border-l border-zinc-200 transition-all duration-300 ease-in-out z-20 shrink-0 overflow-hidden',
          isTerminalOpen ? 'w-[32rem]' : 'w-0'
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

onMounted(async () => {
  await diagramStore.fetchUserDiagrams();
});
</script>

<style scoped>
.fade-enter-active, .fade-leave-active { transition: opacity 0.2s ease; }
.fade-enter-from, .fade-leave-to { opacity: 0; }
</style>
