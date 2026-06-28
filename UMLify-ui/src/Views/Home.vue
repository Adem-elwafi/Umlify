<template>
  <div class="min-h-screen h-screen w-full flex flex-col bg-[#f8fafc] dark:bg-[#0b0f19] text-zinc-900 dark:text-zinc-100 transition-colors duration-200 select-none overflow-hidden font-sans">
    <!-- Master Workspace Header -->
    <header class="h-14 w-full bg-[#f1f5f9] text-[#0f172a] border-b border-slate-200/80 dark:bg-[#111827] dark:text-[#f1f5f9] dark:border-zinc-800/80 transition-colors duration-200 px-6 flex justify-between items-center shrink-0 z-30 shadow-[0_4px_20px_rgba(9,9,11,0.03)] dark:shadow-[0_4px_25px_rgba(0,0,0,0.15)]">
      <!-- Left Branding -->
      <div class="flex items-center gap-2.5 select-none">
        <svg class="w-6 h-6 text-zinc-800 dark:text-zinc-100 transition-colors duration-200" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect x="2" y="3" width="7" height="6" rx="1.5" class="stroke-current" stroke-width="2" stroke-linejoin="round"/>
          <rect x="15" y="3" width="7" height="6" rx="1.5" class="stroke-current" stroke-width="2" stroke-linejoin="round"/>
          <rect x="8.5" y="15" width="7" height="6" rx="1.5" class="stroke-current" stroke-width="2" stroke-linejoin="round"/>
          <path d="M5.5 9V12H8.5V15" class="stroke-current" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
          <path d="M18.5 9V12H15.5V15" class="stroke-current" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
        
        <span class="font-bold tracking-tight text-zinc-800 dark:text-zinc-100 text-lg">UMLify</span>
        <span class="text-[10px] font-semibold bg-zinc-200/60 dark:bg-zinc-800 text-zinc-500 dark:text-zinc-400 px-1.5 py-0.5 rounded-md border border-zinc-300/40 dark:border-zinc-700/40">v1.1</span>
      </div>

      <!-- Center Enterprise Menu -->
      <div class="hidden lg:flex items-center gap-4 text-[11px] font-medium text-zinc-500 dark:text-zinc-400">
        <button class="hover:text-zinc-900 dark:hover:text-white transition-colors cursor-pointer">Workspace Settings</button>
        <div class="w-1 h-1 rounded-full bg-zinc-300 dark:bg-zinc-700"></div>
        <button class="hover:text-zinc-900 dark:hover:text-white transition-colors cursor-pointer">Collaboration Engine</button>
        <div class="w-1 h-1 rounded-full bg-zinc-300 dark:bg-zinc-700"></div>
        <button class="hover:text-zinc-900 dark:hover:text-white transition-colors cursor-pointer">Analytics Profile</button>
      </div>

      <!-- Right Controls -->
      <div class="flex items-center gap-3">
        <div v-if="diagramStore.networkErrorMessage" class="px-3 py-1 bg-rose-500/20 border border-rose-500/35 rounded-lg text-rose-200 text-[10px] font-mono max-w-xs truncate">
          ⚠️ {{ diagramStore.networkErrorMessage }}
        </div>
        
        <button 
          @click="toggleDarkMode" 
          class="p-2 rounded-xl transition-all duration-200 hover:bg-zinc-200/60 dark:hover:bg-zinc-800/60 focus:outline-none focus:ring-2 focus:ring-blue-400/40"
          title="Toggle Visual Theme"
        >
          <Sun v-if="isDarkMode" class="w-5 h-5 text-amber-400" />
          <Moon v-else class="w-5 h-5 text-zinc-700 dark:text-zinc-300" />
        </button>
      </div>
    </header>

    <!-- Horizontal Engineering Telemetry & Property Control Strip -->
    <section class="h-11 w-full bg-white border-b border-zinc-200/80 text-zinc-800 dark:bg-[#111827] dark:border-b dark:border-zinc-800/60 dark:text-zinc-100 transition-colors duration-200 px-6 flex items-center justify-between shrink-0 z-20 shadow-xs">
      <!-- Left side: Spawner toggle and Undo/Redo -->
      <div class="flex items-center gap-3">
        <!-- Spawner Toggle Button -->
        <button 
          @click="isSidebarDrawerOpen = !isSidebarDrawerOpen"
          class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-zinc-200/60 dark:border-zinc-800/60 bg-zinc-50/50 hover:bg-zinc-100 dark:bg-zinc-900/50 dark:hover:bg-zinc-800 text-zinc-700 dark:text-zinc-300 text-[11px] font-medium transition-all active:scale-95 cursor-pointer shadow-xs select-none group"
          title="Toggle Shapes Drawer"
        >
          <Folder class="w-3.5 h-3.5 text-zinc-400 group-hover:text-zinc-700 dark:group-hover:text-white" />
          <span>{{ isSidebarDrawerOpen ? 'Close Spawner' : 'Open Spawner' }}</span>
        </button>

        <!-- Undo/Redo Controls -->
        <div class="flex items-center bg-zinc-50/50 dark:bg-zinc-900/50 border border-zinc-200/60 dark:border-zinc-800/60 rounded-lg p-0.5 shadow-xs gap-0.5">
          <button 
            @click="diagramStore.undo()"
            :class="['w-7 h-7 flex items-center justify-center rounded hover:bg-zinc-200/60 dark:hover:bg-zinc-800 text-zinc-600 dark:text-zinc-300 transition-all active:scale-90', diagramStore.undoStack.length === 0 ? 'opacity-40 pointer-events-none' : '']"
            title="Undo (Ctrl+Z)"
          >
            <Undo2 class="w-3.5 h-3.5" />
          </button>
          <div class="w-px h-3 bg-zinc-200 dark:bg-zinc-800 mx-0.5" />
          <button 
            @click="diagramStore.redo()"
            :class="['w-7 h-7 flex items-center justify-center rounded hover:bg-zinc-200/60 dark:hover:bg-zinc-800 text-zinc-600 dark:text-zinc-300 transition-all active:scale-90', diagramStore.redoStack.length === 0 ? 'opacity-40 pointer-events-none' : '']"
            title="Redo (Ctrl+Y)"
          >
            <Redo2 class="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      <!-- Center side: Telemetry parameters or placeholder -->
      <div class="flex-1 flex justify-center px-4">
        <div v-if="inspectorElement" class="flex items-center gap-6 text-xs text-zinc-700 dark:text-zinc-300">
          <!-- GROUP A: Identity -->
          <div class="flex items-center gap-2">
            <span class="font-bold text-[10px] text-zinc-400 dark:text-zinc-500 uppercase font-mono tracking-wider">Name:</span>
            <input 
              v-model="inspectorElement.label" 
              type="text" 
              class="px-3 py-1.5 text-sm transition-all duration-200 border rounded-xl outline-none focus:ring-2 focus:ring-blue-500/40 focus:border-blue-500/60 bg-zinc-50/80 border-zinc-200 text-zinc-900 dark:bg-zinc-900/60 dark:border-zinc-800/80 dark:text-zinc-100 dark:placeholder-zinc-600 w-48 shadow-xs"
              placeholder="Element Name"
            />
            <span class="text-[10px] font-mono text-zinc-400 dark:text-zinc-500 uppercase ml-1">ID: {{ inspectorElement.id.split('_')[1] || inspectorElement.id.slice(-6) }}</span>
          </div>

          <div class="w-px h-4 bg-zinc-200 dark:bg-zinc-800/80" />

          <!-- GROUP B: Coordinates -->
          <div class="flex items-center gap-3">
            <div class="flex items-center gap-1.5">
              <span class="font-bold text-[10px] text-zinc-400 dark:text-zinc-500 uppercase font-mono tracking-wider">X:</span>
              <input 
                v-model.number="inspectorElement.x" 
                type="number" 
                class="w-16 px-3 py-1.5 text-sm transition-all duration-200 border rounded-xl outline-none focus:ring-2 focus:ring-blue-500/40 focus:border-blue-500/60 bg-zinc-50/80 border-zinc-200 text-zinc-900 dark:bg-zinc-900/60 dark:border-zinc-800/80 dark:text-zinc-100 dark:placeholder-zinc-600 shadow-xs"
              />
            </div>
            <div class="flex items-center gap-1.5">
              <span class="font-bold text-[10px] text-zinc-400 dark:text-zinc-500 uppercase font-mono tracking-wider">Y:</span>
              <input 
                v-model.number="inspectorElement.y" 
                type="number" 
                class="w-16 px-3 py-1.5 text-sm transition-all duration-200 border rounded-xl outline-none focus:ring-2 focus:ring-blue-500/40 focus:border-blue-500/60 bg-zinc-50/80 border-zinc-200 text-zinc-900 dark:bg-zinc-900/60 dark:border-zinc-800/80 dark:text-zinc-100 dark:placeholder-zinc-600 shadow-xs"
              />
            </div>
          </div>

          <div class="w-px h-4 bg-zinc-200 dark:bg-zinc-800/80" />

          <!-- GROUP C: Dimensions -->
          <div class="flex items-center gap-3">
            <div class="flex items-center gap-1.5">
              <span class="font-bold text-[10px] text-zinc-400 dark:text-zinc-500 uppercase font-mono tracking-wider">W:</span>
              <input 
                v-model.number="inspectorElement.width" 
                type="number" 
                class="w-16 px-3 py-1.5 text-sm transition-all duration-200 border rounded-xl outline-none focus:ring-2 focus:ring-blue-500/40 focus:border-blue-500/60 bg-zinc-50/80 border-zinc-200 text-zinc-900 dark:bg-zinc-900/60 dark:border-zinc-800/80 dark:text-zinc-100 dark:placeholder-zinc-600 shadow-xs"
                placeholder="Auto"
              />
            </div>
            <div class="flex items-center gap-1.5">
              <span class="font-bold text-[10px] text-zinc-400 dark:text-zinc-500 uppercase font-mono tracking-wider">H:</span>
              <input 
                v-model.number="inspectorElement.height" 
                type="number" 
                class="w-16 px-3 py-1.5 text-sm transition-all duration-200 border rounded-xl outline-none focus:ring-2 focus:ring-blue-500/40 focus:border-blue-500/60 bg-zinc-50/80 border-zinc-200 text-zinc-900 dark:bg-zinc-900/60 dark:border-zinc-800/80 dark:text-zinc-100 dark:placeholder-zinc-600 shadow-xs"
                placeholder="Auto"
              />
            </div>
          </div>

          <div class="w-px h-4 bg-zinc-200 dark:bg-zinc-800/80" />

          <!-- GROUP D: Layering Bench -->
          <div class="flex items-center gap-3">
            <div class="flex items-center gap-1.5">
              <span class="font-bold text-[10px] text-zinc-400 dark:text-zinc-500 uppercase font-mono tracking-wider">Layer (Z):</span>
              <input 
                v-model.number="inspectorElement.zIndex" 
                type="number" 
                class="w-16 px-3 py-1.5 text-sm transition-all duration-200 border rounded-xl outline-none focus:ring-2 focus:ring-blue-500/40 focus:border-blue-500/60 bg-zinc-50/80 border-zinc-200 text-zinc-900 dark:bg-zinc-900/60 dark:border-zinc-800/80 dark:text-zinc-100 dark:placeholder-zinc-600 shadow-xs"
                placeholder="Auto"
              />
            </div>
            <div class="flex items-center gap-1 bg-zinc-100/40 border border-zinc-200 dark:bg-zinc-900/40 dark:border-zinc-800/80 rounded-xl p-0.5 shadow-xs">
              <button 
                @click="adjustLayer(1)"
                class="p-2 rounded-xl transition-all duration-200 bg-zinc-100 hover:bg-zinc-200 text-zinc-700 dark:bg-zinc-800 dark:hover:bg-zinc-700/80 dark:text-zinc-300 active:scale-90 cursor-pointer flex items-center justify-center"
                title="Bring Forward"
              >
                <ChevronUp class="w-3.5 h-3.5" />
              </button>
              <button 
                @click="adjustLayer(-1)"
                class="p-2 rounded-xl transition-all duration-200 bg-zinc-100 hover:bg-zinc-200 text-zinc-700 dark:bg-zinc-800 dark:hover:bg-zinc-700/80 dark:text-zinc-300 active:scale-90 cursor-pointer flex items-center justify-center"
                title="Send Backward"
              >
                <ChevronDown class="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
        <div v-else class="text-xs text-zinc-400 dark:text-zinc-500 font-mono italic select-none">
          Select an asset to view engineering telemetry...
        </div>
      </div>

      <!-- Right side: Zoom and AI Terminal Controls -->
      <div class="flex items-center gap-3">
        <!-- Zoom Controls -->
        <div class="flex items-center gap-2 bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg p-0.5 shadow-xs">
          <button 
            @click="zoomIn" 
            class="w-6 h-6 flex items-center justify-center hover:bg-zinc-200 dark:hover:bg-zinc-800 text-zinc-600 dark:text-zinc-300 rounded transition-all active:scale-95 cursor-pointer text-sm font-bold" 
            title="Zoom In"
          >
            <span>+</span>
          </button>
          <span class="min-w-[36px] text-center text-[10px] font-bold text-zinc-500 dark:text-zinc-400 font-mono select-none">
            {{ Math.round(diagramStore.zoomLevel * 100) }}%
          </span>
          <button 
            @click="zoomOut" 
            class="w-6 h-6 flex items-center justify-center hover:bg-zinc-200 dark:hover:bg-zinc-800 text-zinc-600 dark:text-zinc-300 rounded transition-all active:scale-95 cursor-pointer text-sm font-bold" 
            title="Zoom Out"
          >
            <span>−</span>
          </button>
          <button 
            @click="resetZoom" 
            class="w-6 h-6 flex items-center justify-center hover:bg-zinc-200 dark:hover:bg-zinc-800 text-zinc-400 dark:text-zinc-500 rounded transition-all active:scale-95 cursor-pointer text-xs" 
            title="Reset Zoom"
          >
            <span>⟲</span>
          </button>
        </div>

        <!-- AI Terminal Toggle Switch -->
        <button 
          @click="isTerminalOpen = !isTerminalOpen"
          :class="[
            'w-9 h-9 flex items-center justify-center p-0 rounded-xl transition-all duration-200 cursor-pointer shadow-xs select-none border',
            isTerminalOpen 
              ? 'bg-zinc-200 hover:bg-zinc-300 text-zinc-850 border-zinc-300 dark:bg-zinc-800 dark:hover:bg-zinc-700/80 dark:text-white dark:border-zinc-700 shadow-inner' 
              : 'bg-zinc-50 hover:bg-zinc-100 border-zinc-200 text-zinc-500 dark:bg-zinc-900 dark:border-zinc-800 dark:text-zinc-400 dark:hover:bg-zinc-800'
          ]"
          title="Toggle AI Terminal"
        >
          <Terminal class="w-4 h-4" />
        </button>
      </div>
    </section>

    <main class="flex-1 w-full flex min-h-0 relative bg-transparent">
      <!-- Collapsible Cloud File Slider Drawer -->
      <aside 
        :class="[
          'absolute top-0 left-0 h-full flex flex-col shrink-0 overflow-hidden bg-[#f1f5f9] dark:bg-[#111827] text-zinc-900 dark:text-zinc-100 border-r border-zinc-200/80 dark:border-zinc-800/60 transition-colors duration-200 z-40',
          isSidebarDrawerOpen ? 'shadow-[8px_0_24px_rgba(9,9,11,0.04)] dark:shadow-[8px_0_32px_rgba(0,0,0,0.3)]' : '',
          isResizing ? '' : 'transition-all duration-300 ease-in-out'
        ]"
        :style="{ width: isSidebarDrawerOpen ? sidebarWidth + 'px' : '0px' }"
      >
        <div class="w-full flex-1 flex flex-col min-h-0">
          <!-- Dual-tab Header Bar -->
          <div class="flex items-center justify-between bg-[#e2e8f0] dark:bg-[#0f172a] text-zinc-800 dark:text-zinc-200 select-none px-3 py-2 shrink-0 border-b border-zinc-200/80 dark:border-zinc-800/60">
            <div class="flex items-center gap-1.5 flex-1 mr-2">
              <!-- Toolbench Tab Button -->
              <button 
                @click="activeSidebarTab = 'tools'"
                :class="[
                  'flex-1 text-center py-1.5 text-[11px] font-bold rounded-lg transition-all cursor-pointer',
                  activeSidebarTab === 'tools' 
                    ? 'bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white shadow-xs' 
                    : 'text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white hover:bg-zinc-250/50 dark:hover:bg-zinc-800/50'
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
                    ? 'bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white shadow-xs' 
                    : 'text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white hover:bg-zinc-250/50 dark:hover:bg-zinc-800/50'
                ]"
              >
                Cloud Files
              </button>
            </div>
            <!-- Close button -->
            <button @click="isSidebarDrawerOpen = false" class="p-1 text-zinc-550 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white transition-colors cursor-pointer rounded-lg hover:bg-zinc-250 dark:hover:bg-zinc-800" title="Close Drawer">
              <X class="w-4 h-4" />
            </button>
          </div>

          <!-- Conditional Tab Content Rendering -->
          <div v-if="activeSidebarTab === 'tools'" class="flex-1 flex flex-col min-h-0 overflow-y-auto">
            <Toolbar />
          </div>
          <div v-else class="flex-1 flex flex-col min-h-0 overflow-y-auto">
            <div class="p-4 border-b border-zinc-200/80 dark:border-zinc-800/60 flex-shrink-0">
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

                <!-- Foreground Layer (Project Details) - Solid mask bg-white dark:bg-[#111827] -->
                <div 
                  @click="handleSelectCloudDiagram(diag.id)"
                  :class="[
                    'absolute inset-0 h-full p-3 transition-transform duration-300 ease-in-out cursor-pointer flex items-center justify-between border rounded-xl bg-white dark:bg-[#111827]',
                    diagramStore.currentDiagramId === diag.id 
                      ? 'border-zinc-350 dark:border-zinc-700 text-zinc-900 dark:text-zinc-100' 
                      : 'border-zinc-200/80 text-zinc-700 hover:bg-zinc-50 dark:text-zinc-300 dark:hover:bg-zinc-800/50',
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
                    class="p-1.5 text-zinc-400 hover:text-zinc-600 dark:text-zinc-500 dark:hover:text-zinc-300 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors cursor-pointer"
                    title="Options"
                  >
                    <MoreVertical class="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </aside>

      <!-- Resizable Sidebar Drag Handle -->
      <div 
        v-if="isSidebarDrawerOpen"
        @mousedown="startResize"
        :class="[
          'absolute top-0 w-1.5 cursor-col-resize hover:bg-blue-500/40 active:bg-blue-500 transition-colors h-full z-45 select-none bg-zinc-200/40 dark:bg-zinc-800/40',
          isResizing ? '' : 'transition-all duration-300 ease-in-out'
        ]"
        :style="{ left: (sidebarWidth - 3) + 'px' }"
      ></div>

      <!-- Main Drawing Area Container -->
      <div class="flex-1 h-full relative bg-[radial-gradient(#e4e4e7_1px,transparent_1px)] [background-size:16px_16px] bg-[#f8fafc] dark:bg-[#0b0f19] transition-all duration-300 overflow-hidden">
        <Canvas 
          :onLogout="handleSignOutFlow" 
        />
      </div>

      <!-- AI Terminal Pane Layout Wrapper -->
      <div 
        :class="[
          'h-full border-l border-slate-200/80 dark:border-zinc-800/50 transition-all duration-300 ease-in-out z-20 shrink-0 overflow-hidden',
          isTerminalOpen ? 'w-[32rem] shadow-[-8px_0_24px_rgba(9,9,11,0.04)] dark:shadow-[-8px_0_32px_rgba(0,0,0,0.3)]' : 'w-0'
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

// Resizable Sidebar Engine
const sidebarWidth = ref(260);
const isResizing = ref(false);

const startResize = (e) => {
  isResizing.value = true;
  document.addEventListener('mousemove', handleResize);
  document.addEventListener('mouseup', stopResize);
};

const handleResize = (e) => {
  if (!isResizing.value) return;
  // Constrain resizing between 200px and 450px
  if (e.clientX >= 200 && e.clientX <= 450) {
    sidebarWidth.value = e.clientX;
  }
};

const stopResize = () => {
  isResizing.value = false;
  document.removeEventListener('mousemove', handleResize);
  document.removeEventListener('mouseup', stopResize);
};

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
  swipedRowId.value = null;
  const loaded = await diagramStore.loadDiagramById(id);
  if (loaded) {
    isSidebarDrawerOpen.value = false;
  }
};

const createNewCanvasAction = () => {
  swipedRowId.value = null;
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
