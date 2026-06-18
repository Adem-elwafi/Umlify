<template>
  <div class="h-full w-full flex flex-col bg-zinc-50 select-none overflow-hidden font-sans">
    <!-- Master Workspace Header -->
    <header class="h-14 w-full bg-primary-slate border-b border-primary-slate/50 px-6 flex justify-between items-center shrink-0 z-30 shadow-xs">
      <div class="flex items-center gap-4">
        <button 
          @click="isSidebarDrawerOpen = !isSidebarDrawerOpen"
          class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 border border-white/10 text-zinc-100 text-xs font-medium transition-all active:scale-95 cursor-pointer shadow-xs select-none group"
          title="Toggle Cloud Directory Drawer"
        >
          <Folder class="w-3.5 h-3.5 text-zinc-300 group-hover:text-white" />
          <span>Cloud Files</span>
        </button>

        <div class="flex items-center gap-2">
          <div class="w-6 h-6 rounded bg-white/10 flex items-center justify-center font-bold text-white text-xs select-none">U</div>
          <h1 class="text-sm font-semibold tracking-tight text-white select-none font-sans">UMLify Workspace</h1>
          
          <!-- Typography Modifier Hook -->
          <div class="ml-2 flex items-center gap-1 px-2 py-1 bg-white/10 border border-white/10 rounded-lg text-[10px] font-medium text-zinc-300 cursor-default">
            <Type class="w-3 h-3" />
            <span>Inter</span>
            <ChevronDown class="w-2.5 h-2.5" />
          </div>
        </div>
      </div>

      <!-- Operational Telemetry Controls -->
      <div class="flex items-center bg-white/10 border border-white/10 rounded-xl p-1 gap-1 shadow-xs">
        <button 
          @click="diagramStore.undo()"
          :class="['w-8 h-8 flex items-center justify-center rounded-lg hover:bg-white/10 hover:shadow-sm text-zinc-100 transition-all active:scale-90', diagramStore.undoStack.length === 0 ? 'opacity-40 pointer-events-none' : '']"
          title="Undo (Ctrl+Z)"
        >
          <Undo2 class="w-4 h-4" />
        </button>
        <div class="w-px h-4 bg-white/10 mx-0.5" />
        <button 
          @click="diagramStore.redo()"
          :class="['w-8 h-8 flex items-center justify-center rounded-lg hover:bg-white/10 hover:shadow-sm text-zinc-100 transition-all active:scale-90', diagramStore.redoStack.length === 0 ? 'opacity-40 pointer-events-none' : '']"
          title="Redo (Ctrl+Y)"
        >
          <Redo2 class="w-4 h-4" />
        </button>
      </div>

      <div v-if="diagramStore.networkErrorMessage" class="px-4 py-1.5 bg-rose-500/10 border border-rose-500/20 rounded-lg text-rose-300 text-[10px] font-mono max-w-xl truncate">
        ⚠️ {{ diagramStore.networkErrorMessage }}
      </div>
      
      <div class="flex items-center">
        <button 
          @click="isTerminalOpen = !isTerminalOpen"
          :class="isTerminalOpen 
            ? 'inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-accent-blue text-white text-xs font-medium transition-all cursor-pointer shadow-sm select-none' 
            : 'inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 border border-white/10 text-zinc-100 text-xs font-medium transition-all active:scale-95 cursor-pointer shadow-xs select-none'"
        >
          <Terminal class="w-3.5 h-3.5" />
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
          <div class="flex items-center gap-2">
            <Folder class="w-3.5 h-3.5" />
            <span>Cloud Projects Directory</span>
          </div>
          <button @click="isSidebarDrawerOpen = false" class="text-zinc-400 hover:text-zinc-600 transition-colors cursor-pointer">
            <X class="w-4 h-4" />
          </button>
        </div>

        <div class="p-4">
          <button 
            @click="createNewCanvasAction" 
            class="w-full py-2 bg-zinc-900 hover:bg-zinc-800 text-white text-xs font-semibold rounded-lg shadow-sm transition-all active:scale-98 cursor-pointer text-center"
          >
            New Clean Canvas
          </button>
        </div>

        <div class="flex-1 overflow-y-auto px-2 pb-4 space-y-1 mt-2">
          <div v-if="diagramStore.savedDiagramsList.length === 0" class="text-center text-zinc-400 text-[11px] p-8 italic font-mono">
            No cloud storage records found.
          </div>
          
          <!-- Saved Diagram Database Rows (Swipe-to-Reveal-Delete Pattern) -->
          <div 
            v-for="diag in diagramStore.savedDiagramsList" 
            :key="diag.id"
            class="relative h-[60px] mx-1 rounded-xl overflow-hidden bg-rose-600 shadow-sm"
          >
            <!-- Background Layer (Delete Button) -->
            <div class="absolute inset-0 flex justify-end">
              <button 
                @click.stop="promptDelete(diag)"
                class="w-[80px] h-full flex flex-col items-center justify-center text-white hover:bg-rose-700 transition-colors cursor-pointer"
                title="Permanently Delete"
              >
                <Trash2 class="w-4 h-4 mb-1" />
                <span class="text-[9px] font-bold uppercase tracking-widest">Delete</span>
              </button>
            </div>

            <!-- Foreground Layer (Project Details) -->
            <div 
              @click="handleSelectCloudDiagram(diag.id)"
              :class="[
                'absolute inset-0 h-full p-3 transition-transform duration-300 ease-in-out cursor-pointer flex items-center justify-between border rounded-xl',
                diagramStore.currentDiagramId === diag.id 
                  ? 'bg-zinc-100 border-zinc-200 text-zinc-900' 
                  : 'bg-white border-zinc-100 text-zinc-700 hover:bg-zinc-50 hover:text-zinc-900',
                swipedRowId === diag.id ? '-translate-x-[80px]' : 'translate-x-0'
              ]"
            >
              <div class="truncate mr-2 flex-1">
                <p class="text-xs font-semibold truncate">{{ diag.title || 'Untitled Diagram' }}</p>
                <p class="text-[10px] text-zinc-400 font-mono tracking-normal mt-0.5">
                  {{ new Date(diag.updatedAt || diag.createdAt).toLocaleDateString() }}
                </p>
              </div>
              <button 
                @click.stop="toggleSwipe(diag.id)"
                class="p-1.5 text-zinc-300 hover:text-zinc-500 rounded-lg hover:bg-zinc-200 transition-colors cursor-pointer"
                title="Options"
              >
                <MoreVertical class="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        <!-- Trash/Delete Zone Placeholder -->
        <div class="p-4 border-t border-zinc-100 mt-auto">
          <div class="w-full py-3 border border-dashed border-zinc-200 rounded-xl flex flex-col items-center justify-center gap-1.5 text-zinc-400 group hover:border-rose-200 hover:bg-rose-50/30 transition-all">
            <Trash2 class="w-4 h-4 group-hover:text-rose-500" />
            <span class="text-[9px] uppercase font-bold tracking-widest group-hover:text-rose-600">Drop to Delete</span>
          </div>
        </div>
      </div>

      <!-- Main Drawing Area Container -->
      <div class="flex-1 h-full relative bg-[radial-gradient(#e4e4e7_1px,transparent_1px)] [background-size:16px_16px] bg-zinc-50 transition-all duration-300 overflow-hidden">
        <Canvas 
          :onLogout="handleSignOutFlow" 
          :isSidebarDrawerOpen="isSidebarDrawerOpen"
        />
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

    <!-- Global Confirmation Modal Wrapper -->
    <transition name="fade">
      <div 
        v-if="diagramStore.globalModalConfig.isOpen" 
        class="fixed inset-0 z-[100] flex items-center justify-center"
      >
        <div 
          class="absolute inset-0 bg-[#213C51]/80 backdrop-blur-sm"
          @click="diagramStore.closeGlobalModal()"
        ></div>
        <div class="relative bg-white rounded-2xl shadow-2xl w-full max-w-sm overflow-hidden flex flex-col p-6 scale-100 transition-transform">
          <h3 class="text-lg font-semibold text-zinc-900 mb-2">{{ diagramStore.globalModalConfig.title }}</h3>
          <p class="text-sm text-zinc-500 mb-6">{{ diagramStore.globalModalConfig.message }}</p>
          <div class="flex justify-end gap-3 mt-auto">
            <button 
              @click="diagramStore.closeGlobalModal()"
              class="px-4 py-2 text-xs font-semibold text-zinc-600 bg-zinc-100 hover:bg-zinc-200 rounded-lg transition-colors cursor-pointer"
            >
              {{ diagramStore.globalModalConfig.cancelText }}
            </button>
            <button 
              @click="executeGlobalConfirm"
              class="px-4 py-2 text-xs font-semibold text-white bg-rose-600 hover:bg-rose-700 rounded-lg transition-colors shadow-sm cursor-pointer"
            >
              {{ diagramStore.globalModalConfig.confirmText }}
            </button>
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useDiagramStore } from '../stores/diagramStore';
import { useAuthStore } from '../stores/authStore';
import Canvas from '../components/Canvas.vue';
import TerminalEditor from '../components/TerminalEditor.vue';
import { 
  Folder, 
  Terminal, 
  X, 
  Trash2, 
  FileJson,
  Undo2,
  Redo2,
  ChevronDown,
  Type,
  MoreVertical
} from 'lucide-vue-next';

const diagramStore = useDiagramStore();
const authStore = useAuthStore();

const isTerminalOpen = ref(true);
const isSidebarDrawerOpen = ref(false);
const swipedRowId = ref(null);

const toggleSwipe = (id) => {
  if (swipedRowId.value === id) {
    swipedRowId.value = null;
  } else {
    swipedRowId.value = id;
  }
};

const promptDelete = (diag) => {
  diagramStore.openGlobalConfirmation({
    title: 'Delete Cloud Project',
    message: `Are you sure you want to permanently delete "${diag.title || 'Untitled Diagram'}" from the remote cloud repository? This action is irreversible.`,
    confirmText: 'Delete Project',
    cancelText: 'Cancel',
    onConfirm: async () => {
      const success = await diagramStore.deleteDiagram(diag.id);
      if (success) {
        swipedRowId.value = null;
      }
    }
  });
};

const executeGlobalConfirm = async () => {
  if (diagramStore.globalModalConfig.onConfirm) {
    await diagramStore.globalModalConfig.onConfirm();
  }
  diagramStore.closeGlobalModal();
};

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
