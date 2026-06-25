<template>
  <div class="h-full w-full flex flex-col bg-zinc-50 select-none overflow-hidden font-sans">
    <!-- Master Workspace Header -->
    <header class="h-14 w-full bg-[#213C51] text-white border-b border-white/10 dark:bg-[#0f172a] dark:text-slate-100 dark:border-b dark:border-zinc-800/80 transition-colors duration-200 px-6 flex justify-between items-center shrink-0 z-30 shadow-xs">
      <div class="flex items-center gap-4">
        <button 
          @click="isSidebarDrawerOpen = !isSidebarDrawerOpen"
          class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/15 dark:hover:bg-slate-800/60 border border-white/10 text-zinc-100 text-xs font-medium transition-all duration-200 active:scale-95 cursor-pointer shadow-xs select-none group"
          title="Toggle Sidebar Drawer"
        >
          <Folder class="w-3.5 h-3.5 text-zinc-300 group-hover:text-white" />
          <span>{{ isSidebarDrawerOpen ? 'Close Drawer' : 'Open Drawer' }}</span>
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
      
      <div class="flex items-center gap-2">
        <button 
          @click="toggleDarkMode" 
          class="p-2 rounded-xl transition-all duration-200 hover:bg-white/15 dark:hover:bg-slate-800/60 focus:outline-none focus:ring-2 focus:ring-blue-400/40"
          title="Toggle Visual Theme"
        >
          <Sun v-if="isDarkMode" class="w-5 h-5 text-amber-400" />
          <Moon v-else class="w-5 h-5 text-slate-200" />
        </button>
        <button 
          @click="isTerminalOpen = !isTerminalOpen"
          :class="isTerminalOpen 
            ? 'inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-accent-blue hover:bg-accent-blue/90 text-white text-xs font-medium transition-all duration-200 cursor-pointer shadow-sm select-none' 
            : 'inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/15 dark:hover:bg-slate-800/60 border border-white/10 text-zinc-100 text-xs font-medium transition-all duration-200 active:scale-95 cursor-pointer shadow-xs select-none'"
        >
          <Terminal class="w-3.5 h-3.5" />
          <span>{{ isTerminalOpen ? 'Hide Terminal' : 'AI Terminal' }}</span>
        </button>
      </div>
    </header>

    <!-- Horizontal Engineering Telemetry & Property Control Strip -->
    <section class="h-11 w-full bg-white border-b border-zinc-200 px-6 flex items-center justify-between shrink-0 z-20 shadow-xs">
      <!-- Left side: Telemetry parameters or placeholder -->
      <div class="flex-1 flex items-center">
        <div v-if="inspectorElement" class="flex items-center gap-6 text-xs text-zinc-700">
          <!-- GROUP A: Identity -->
          <div class="flex items-center gap-2">
            <span class="font-bold text-[10px] text-zinc-400 uppercase font-mono tracking-wider">Name:</span>
            <input 
              v-model="inspectorElement.label" 
              type="text" 
              class="bg-zinc-50 border border-zinc-200 rounded-lg px-2.5 py-1 text-xs font-semibold text-zinc-900 focus:outline-none focus:border-zinc-400 focus:ring-1 focus:ring-zinc-400 transition-all w-48 shadow-xs"
              placeholder="Element Name"
            />
            <span class="text-[10px] font-mono text-zinc-400 uppercase ml-1">ID: {{ inspectorElement.id.split('_')[1] || inspectorElement.id.slice(-6) }}</span>
          </div>

          <div class="w-px h-4 bg-zinc-200" />

          <!-- GROUP B: Coordinates -->
          <div class="flex items-center gap-3">
            <div class="flex items-center gap-1.5">
              <span class="font-bold text-[10px] text-zinc-400 uppercase font-mono tracking-wider">X:</span>
              <input 
                v-model.number="inspectorElement.x" 
                type="number" 
                class="w-16 bg-zinc-50 border border-zinc-200 rounded-lg px-2 py-1 text-xs font-semibold text-zinc-900 focus:outline-none focus:border-zinc-400 focus:ring-1 focus:ring-zinc-400 transition-all shadow-xs"
              />
            </div>
            <div class="flex items-center gap-1.5">
              <span class="font-bold text-[10px] text-zinc-400 uppercase font-mono tracking-wider">Y:</span>
              <input 
                v-model.number="inspectorElement.y" 
                type="number" 
                class="w-16 bg-zinc-50 border border-zinc-200 rounded-lg px-2 py-1 text-xs font-semibold text-zinc-900 focus:outline-none focus:border-zinc-400 focus:ring-1 focus:ring-zinc-400 transition-all shadow-xs"
              />
            </div>
          </div>

          <div class="w-px h-4 bg-zinc-200" />

          <!-- GROUP C: Dimensions -->
          <div class="flex items-center gap-3">
            <div class="flex items-center gap-1.5">
              <span class="font-bold text-[10px] text-zinc-400 uppercase font-mono tracking-wider">W:</span>
              <input 
                v-model.number="inspectorElement.width" 
                type="number" 
                class="w-16 bg-zinc-50 border border-zinc-200 rounded-lg px-2 py-1 text-xs font-semibold text-zinc-900 focus:outline-none focus:border-zinc-400 focus:ring-1 focus:ring-zinc-400 transition-all shadow-xs"
                placeholder="Auto"
              />
           </div>
           <div class="flex items-center gap-1.5">
             <span class="font-bold text-[10px] text-zinc-400 uppercase font-mono tracking-wider">H:</span>
             <input 
               v-model.number="inspectorElement.height" 
               type="number" 
               class="w-16 bg-zinc-50 border border-zinc-200 rounded-lg px-2 py-1 text-xs font-semibold text-zinc-900 focus:outline-none focus:border-zinc-400 focus:ring-1 focus:ring-zinc-400 transition-all shadow-xs"
               placeholder="Auto"
             />
           </div>
         </div>

         <div class="w-px h-4 bg-zinc-200" />

         <!-- GROUP D: Layering Bench -->
         <div class="flex items-center gap-3">
           <div class="flex items-center gap-1.5">
             <span class="font-bold text-[10px] text-zinc-400 uppercase font-mono tracking-wider">Layer (Z):</span>
             <input 
               v-model.number="inspectorElement.zIndex" 
               type="number" 
               class="w-16 bg-zinc-50 border border-zinc-200 rounded-lg px-2 py-1 text-xs font-semibold text-zinc-900 focus:outline-none focus:border-zinc-400 focus:ring-1 focus:ring-zinc-400 transition-all shadow-xs"
               placeholder="Auto"
             />
           </div>
           <div class="flex items-center gap-1 bg-zinc-100 border border-zinc-200 rounded-lg p-0.5 shadow-xs">
             <button 
               @click="adjustLayer(1)"
               class="p-1 hover:bg-zinc-200 text-zinc-600 rounded transition-all active:scale-90 cursor-pointer flex items-center justify-center"
               title="Bring Forward"
             >
               <ChevronUp class="w-3.5 h-3.5" />
             </button>
             <button 
               @click="adjustLayer(-1)"
               class="p-1 hover:bg-zinc-200 text-zinc-600 rounded transition-all active:scale-90 cursor-pointer flex items-center justify-center"
               title="Send Backward"
             >
               <ChevronDown class="w-3.5 h-3.5" />
             </button>
           </div>
         </div>
        </div>
        <div v-else class="text-xs text-zinc-400 font-mono italic select-none">
          Select an asset to view engineering telemetry...
        </div>
      </div>

      <!-- Right side: Zoom Controls -->
      <div class="flex items-center gap-2 bg-zinc-50 border border-zinc-200 rounded-lg p-0.5 shadow-xs ml-4">
        <button 
          @click="zoomIn" 
          class="w-6 h-6 flex items-center justify-center hover:bg-zinc-200 text-zinc-600 rounded transition-all active:scale-95 cursor-pointer text-sm font-bold" 
          title="Zoom In"
        >
          <span>+</span>
        </button>
        <span class="min-w-[36px] text-center text-[10px] font-bold text-zinc-500 font-mono select-none">
          {{ Math.round(diagramStore.zoomLevel * 100) }}%
        </span>
        <button 
          @click="zoomOut" 
          class="w-6 h-6 flex items-center justify-center hover:bg-zinc-200 text-zinc-600 rounded transition-all active:scale-95 cursor-pointer text-sm font-bold" 
          title="Zoom Out"
        >
          <span>−</span>
        </button>
        <button 
          @click="resetZoom" 
          class="w-6 h-6 flex items-center justify-center hover:bg-zinc-200 text-zinc-400 rounded transition-all active:scale-95 cursor-pointer text-xs" 
          title="Reset Zoom"
        >
          <span>⟲</span>
        </button>
      </div>
    </section>

    <main class="flex-1 w-full flex min-h-0 relative">
      <!-- Collapsible Cloud File Slider Drawer -->
      <div 
        :class="[
          'h-full bg-white border-r border-zinc-200 transition-all duration-300 ease-in-out flex flex-col shrink-0 overflow-hidden',
          isSidebarDrawerOpen ? 'w-80' : 'w-0'
        ]"
      >
        <div class="w-80 flex-1 flex flex-col min-h-0">
          <!-- Dual-tab Header Bar -->
          <div class="flex items-center justify-between bg-[#213C51] text-white select-none px-3 py-2 shrink-0 border-b border-[#1a3041]">
            <div class="flex items-center gap-1.5 flex-1 mr-2">
              <!-- Toolbench Tab Button -->
              <button 
                @click="activeSidebarTab = 'tools'"
                :class="[
                  'flex-1 text-center py-1.5 text-[11px] font-bold rounded-lg transition-all cursor-pointer',
                  activeSidebarTab === 'tools' 
                    ? 'bg-white/20 text-white shadow-xs' 
                    : 'text-zinc-300 hover:text-white hover:bg-white/5'
                ]"
              >
                Toolbench
              </button>
              <!-- Cloud Files Tab Button -->
              <button 
                @click="activeSidebarTab = 'cloud'"
                :class="[
                  'flex-1 text-center py-1.5 text-[11px] font-bold rounded-lg transition-all cursor-pointer',
                  activeSidebarTab === 'cloud' 
                    ? 'bg-white/20 text-white shadow-xs' 
                    : 'text-zinc-300 hover:text-white hover:bg-white/5'
                ]"
              >
                Cloud Files
              </button>
            </div>
            <!-- Close button -->
            <button @click="isSidebarDrawerOpen = false" class="p-1 text-zinc-300 hover:text-white transition-colors cursor-pointer rounded-lg hover:bg-white/10" title="Close Drawer">
              <X class="w-4 h-4" />
            </button>
          </div>

          <!-- Conditional Tab Content Rendering -->
          <div v-if="activeSidebarTab === 'tools'" class="flex-1 flex flex-col min-h-0 overflow-y-auto">
            <Toolbar />
          </div>
          <div v-else class="flex-1 flex flex-col min-h-0 overflow-y-auto">
            <div class="p-4 border-b border-zinc-100 flex-shrink-0">
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
            <div class="p-4 border-t border-zinc-100 mt-auto flex-shrink-0">
              <div class="w-full py-3 border border-dashed border-zinc-200 rounded-xl flex flex-col items-center justify-center gap-1.5 text-zinc-400 group hover:border-rose-200 hover:bg-rose-50/30 transition-all">
                <Trash2 class="w-4 h-4 group-hover:text-rose-500" />
                <span class="text-[9px] uppercase font-bold tracking-widest group-hover:text-rose-600">Drop to Delete</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Main Drawing Area Container -->
      <div class="flex-1 h-full relative bg-[radial-gradient(#e4e4e7_1px,transparent_1px)] [background-size:16px_16px] bg-zinc-50 transition-all duration-300 overflow-hidden">
        <Canvas 
          :onLogout="handleSignOutFlow" 
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
import { ref, onMounted, onUnmounted, computed } from 'vue';
import { useDiagramStore } from '../stores/diagramStore';
import { useAuthStore } from '../stores/authStore';
import Canvas from '../components/Canvas.vue';
import Toolbar from '../components/Toolbar.vue';
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
  ChevronUp,
  Type,
  MoreVertical,
  Sun,
  Moon
} from 'lucide-vue-next';

const diagramStore = useDiagramStore();
const authStore = useAuthStore();

const isTerminalOpen = ref(true);
const isSidebarDrawerOpen = ref(true);
const activeSidebarTab = ref('tools');
const swipedRowId = ref(null);

const isDarkMode = ref(false);
const toggleDarkMode = () => {
  isDarkMode.value = !isDarkMode.value;
  if (isDarkMode.value) {
    document.documentElement.classList.add('dark');
    localStorage.setItem('theme', 'dark');
  } else {
    document.documentElement.classList.remove('dark');
    localStorage.setItem('theme', 'light');
  }
};

const inspectorElement = computed(() => {
  if (diagramStore.selectedElements.length === 1) {
    return diagramStore.elements.find(e => String(e.id) === String(diagramStore.selectedElements[0])) || null;
  }
  return null;
});

function adjustLayer(delta) {
  if (!inspectorElement.value) return;
  if (typeof diagramStore.saveToHistory === 'function') {
    diagramStore.saveToHistory();
  }
  let currentZ = inspectorElement.value.zIndex;
  if (typeof currentZ !== 'number') {
    let baseZIndex = 10;
    if (inspectorElement.value.type === 'System' || inspectorElement.value.type === 'package') {
      baseZIndex = 5;
    } else {
      baseZIndex = 10;
    }
    currentZ = baseZIndex;
  }
  inspectorElement.value.zIndex = currentZ + delta;
}

function zoomIn() {
  if (diagramStore.zoomLevel < 2) {
    diagramStore.zoomLevel = Math.min(2, diagramStore.zoomLevel + 0.1);
  }
}

function zoomOut() {
  if (diagramStore.zoomLevel > 0.5) {
    diagramStore.zoomLevel = Math.max(0.5, diagramStore.zoomLevel - 0.1);
  }
}

function resetZoom() {
  diagramStore.zoomLevel = 1;
}

const handleBeforeUnload = (event) => {
  if (diagramStore.isDirty && diagramStore.elements.length > 0) {
    event.preventDefault();
    event.returnValue = ''; // Standard browser prompt
  }
};

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
  if (localStorage.getItem('theme') === 'dark' || 
     (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
    isDarkMode.value = true;
    document.documentElement.classList.add('dark');
  } else {
    isDarkMode.value = false;
    document.documentElement.classList.remove('dark');
  }
  window.addEventListener('beforeunload', handleBeforeUnload);
  await diagramStore.fetchUserDiagrams();
});

onUnmounted(() => {
  window.removeEventListener('beforeunload', handleBeforeUnload);
});
</script>

<style scoped>
.fade-enter-active, .fade-leave-active { transition: opacity 0.2s ease; }
.fade-enter-from, .fade-leave-to { opacity: 0; }
</style>
