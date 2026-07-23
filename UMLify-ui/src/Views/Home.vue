<template>
  <Stack class="h-screen w-screen overflow-hidden bg-bg-base text-text-primary font-sans select-none" gap="none">
    <!-- Combined Top-Level Header Block -->
    <div class="w-full flex flex-col shrink-0 z-35">
      <!-- Master Workspace Header -->
      <Surface as="header" depth="1" :border="false" customClass="h-14 w-full flex justify-between items-center px-6 border-b border-bar-border bg-navbar-bg shadow-xs">
        <!-- Left Branding -->
        <div class="flex items-center gap-2.5 select-none text-white">
          <svg class="w-6 h-6 text-interactive-accent transition-colors duration-200" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect x="2" y="3" width="7" height="6" rx="1.5" class="stroke-current" stroke-width="2" stroke-linejoin="round"/>
            <rect x="15" y="3" width="7" height="6" rx="1.5" class="stroke-current" stroke-width="2" stroke-linejoin="round"/>
            <rect x="8.5" y="15" width="7" height="6" rx="1.5" class="stroke-current" stroke-width="2" stroke-linejoin="round"/>
            <path d="M5.5 9V12H8.5V15" class="stroke-current" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
            <path d="M18.5 9V12H15.5V15" class="stroke-current" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
          
          <span class="font-bold tracking-tight text-white text-lg">UMLify</span>
          <span class="text-[10px] font-semibold bg-white/15 text-white px-1.5 py-0.5 rounded-md border border-white/10">v0.2.0-alpha</span>
        </div>

        <!-- Center Enterprise Menu -->
        <div class="hidden lg:flex items-center gap-4 text-[11px] font-medium text-white/80">
          <button class="hover:text-white transition-colors cursor-pointer">Workspace Settings</button>
          <div class="w-1 h-1 rounded-full bg-white/30"></div>
          <button class="hover:text-white transition-colors cursor-pointer">Collaboration Engine</button>
          <div class="w-1 h-1 rounded-full bg-white/30"></div>
          <button class="hover:text-white transition-colors cursor-pointer">Analytics Profile</button>
        </div>

        <!-- Right Controls -->
        <div class="flex items-center gap-3">
          <div v-if="diagramStore.networkErrorMessage" class="px-3 py-1 bg-rose-500/20 border border-rose-500/35 rounded-lg text-rose-200 text-[10px] font-mono max-w-xs truncate">
            ⚠️ {{ diagramStore.networkErrorMessage }}
          </div>
          
          <button 
            @click="toggleDarkMode" 
            class="p-2 rounded-xl transition-all duration-200 hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-white/20 text-white/90 hover:text-white"
            title="Toggle Visual Theme"
          >
            <Sun v-if="isDarkMode" class="w-5 h-5 text-amber-300" />
            <Moon v-else class="w-5 h-5 text-white/90" />
          </button>
        </div>
      </Surface>

      <!-- Horizontal Engineering Telemetry & Property Control Strip -->
      <Surface as="section" depth="1" :border="false" customClass="h-11 w-full flex items-center justify-between px-6 border-b border-border-default bg-bg-surface/30 shadow-xs">
        <!-- Left side: Spawner toggle and Undo/Redo -->
        <div class="flex items-center gap-3">
          <!-- Undo/Redo Controls -->
          <div class="flex items-center bg-bg-surface border border-border-default rounded-lg p-0.5 shadow-xs gap-0.5">
            <button 
              @click="diagramStore.undo()"
              :class="['w-7 h-7 flex items-center justify-center rounded hover:bg-bg-elevated text-text-secondary transition-all active:scale-90', diagramStore.undoStack.length === 0 ? 'opacity-40 pointer-events-none' : '']"
              title="Undo (Ctrl+Z)"
            >
              <Undo2 class="w-3.5 h-3.5" />
            </button>
            <div class="w-px h-3 bg-border-default mx-0.5" />
            <button 
              @click="diagramStore.redo()"
              :class="['w-7 h-7 flex items-center justify-center rounded hover:bg-bg-elevated text-text-secondary transition-all active:scale-90', diagramStore.redoStack.length === 0 ? 'opacity-40 pointer-events-none' : '']"
              title="Redo (Ctrl+Y)"
            >
              <Redo2 class="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        <!-- Center side: Telemetry parameters -->
        <div class="flex-1 flex justify-center px-4">
          <div v-if="inspectorElement" class="flex items-center gap-6 text-xs text-text-secondary animate-fade-in">
            <!-- GROUP A: Identity -->
            <div class="flex items-center gap-2">
              <span class="font-bold text-[10px] text-text-muted uppercase font-mono tracking-wider">Name:</span>
              <input 
                :value="inspectorElement.label" 
                @input="diagramStore.updateElementLabel(inspectorElement.id, $event.target.value)"
                type="text" 
                class="px-3 py-1.5 text-sm transition-all duration-200 border rounded-xl outline-none focus:ring-2 focus:ring-interactive-accent/45 bg-bg-base border-border-default text-text-primary w-48 shadow-xs"
                placeholder="Element Name"
              />
              <span class="text-[10px] font-mono text-text-muted uppercase ml-1">ID: {{ inspectorElement.id.split('_')[1] || inspectorElement.id.slice(-6) }}</span>
            </div>

            <div class="w-px h-4 bg-border-default" />

            <!-- GROUP B: Coordinates -->
            <div class="flex items-center gap-3">
              <div class="flex items-center gap-1.5">
                <span class="font-bold text-[10px] text-text-muted uppercase font-mono tracking-wider">X:</span>
                <input 
                  :value="inspectorElement.x" 
                  @input="diagramStore.updateElementPosition(inspectorElement.id, Number($event.target.value), inspectorElement.y)"
                  type="number" 
                  class="w-16 px-3 py-1.5 text-sm transition-all duration-200 border rounded-xl outline-none focus:ring-2 focus:ring-interactive-accent/45 bg-bg-base border-border-default text-text-primary shadow-xs"
                />
              </div>
              <div class="flex items-center gap-1.5">
                <span class="font-bold text-[10px] text-text-muted uppercase font-mono tracking-wider">Y:</span>
                <input 
                  :value="inspectorElement.y" 
                  @input="diagramStore.updateElementPosition(inspectorElement.id, inspectorElement.x, Number($event.target.value))"
                  type="number" 
                  class="w-16 px-3 py-1.5 text-sm transition-all duration-200 border rounded-xl outline-none focus:ring-2 focus:ring-interactive-accent/45 bg-bg-base border-border-default text-text-primary shadow-xs"
                />
              </div>
            </div>

            <div class="w-px h-4 bg-border-default" />

            <!-- GROUP C: Dimensions -->
            <div class="flex items-center gap-3">
              <div class="flex items-center gap-1.5">
                <span class="font-bold text-[10px] text-text-muted uppercase font-mono tracking-wider">W:</span>
                <input 
                  :value="inspectorElement.width" 
                  @input="diagramStore.updateElementSize(inspectorElement.id, Number($event.target.value), inspectorElement.height)"
                  type="number" 
                  class="w-16 px-3 py-1.5 text-sm transition-all duration-200 border rounded-xl outline-none focus:ring-2 focus:ring-interactive-accent/45 bg-bg-base border-border-default text-text-primary shadow-xs"
                  placeholder="Auto"
                />
              </div>
              <div class="flex items-center gap-1.5">
                <span class="font-bold text-[10px] text-text-muted uppercase font-mono tracking-wider">H:</span>
                <input 
                  :value="inspectorElement.height" 
                  @input="diagramStore.updateElementSize(inspectorElement.id, inspectorElement.width, Number($event.target.value))"
                  type="number" 
                  class="w-16 px-3 py-1.5 text-sm transition-all duration-200 border rounded-xl outline-none focus:ring-2 focus:ring-interactive-accent/45 bg-bg-base border-border-default text-text-primary shadow-xs"
                  placeholder="Auto"
                />
              </div>
            </div>

            <div class="w-px h-4 bg-border-default" />

            <!-- GROUP D: Layering Bench -->
            <div class="flex items-center gap-3">
              <div class="flex items-center gap-1.5">
                <span class="font-bold text-[10px] text-text-muted uppercase font-mono tracking-wider">Layer:</span>
                <input 
                  :value="inspectorElement.zIndex" 
                  @input="diagramStore.updateElementZIndex(inspectorElement.id, Number($event.target.value))"
                  type="number" 
                  class="w-16 px-3 py-1.5 text-sm transition-all duration-200 border rounded-xl outline-none focus:ring-2 focus:ring-interactive-accent/45 bg-bg-base border-border-default text-text-primary shadow-xs"
                  placeholder="Auto"
                />
              </div>
              <div class="flex items-center gap-1 bg-bg-surface border border-border-default rounded-xl p-0.5 shadow-xs">
                <button 
                  @click="adjustLayer(1)"
                  class="p-2 rounded-xl transition-all duration-200 bg-bg-surface hover:bg-bg-elevated text-text-primary active:scale-90 cursor-pointer flex items-center justify-center"
                  title="Bring Forward"
                >
                  <ChevronUp class="w-3.5 h-3.5" />
                </button>
                <button 
                  @click="adjustLayer(-1)"
                  class="p-2 rounded-xl transition-all duration-200 bg-bg-surface hover:bg-bg-elevated text-text-primary active:scale-90 cursor-pointer flex items-center justify-center"
                  title="Send Backward"
                >
                  <ChevronDown class="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
          <div v-else class="text-xs text-text-muted font-mono italic select-none">
            Select an asset to view engineering telemetry...
          </div>
        </div>

        <!-- Right side: Zoom and AI Terminal Controls -->
        <div class="flex items-center gap-3">
          <!-- Zoom Controls -->
          <div class="flex items-center gap-2 bg-bg-surface border border-border-default rounded-lg p-0.5 shadow-xs">
            <button 
              @click="zoomIn" 
              class="w-6 h-6 flex items-center justify-center hover:bg-bg-elevated text-text-primary rounded transition-all active:scale-95 cursor-pointer text-sm font-bold" 
              title="Zoom In"
            >
              <span>+</span>
            </button>
            <span class="min-w-[36px] text-center text-[10px] font-bold text-text-secondary font-mono select-none">
              {{ Math.round(diagramStore.zoomLevel * 100) }}%
            </span>
            <button 
              @click="zoomOut" 
              class="w-6 h-6 flex items-center justify-center hover:bg-bg-elevated text-text-primary rounded transition-all active:scale-95 cursor-pointer text-sm font-bold" 
              title="Zoom Out"
            >
              <span>−</span>
            </button>
            <button 
              @click="resetZoom" 
              class="w-6 h-6 flex items-center justify-center hover:bg-bg-elevated text-text-muted rounded transition-all active:scale-95 cursor-pointer text-xs" 
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
                ? 'bg-bg-elevated text-text-primary border-border-elevated shadow-inner' 
                : 'bg-bg-surface border-border-default text-text-secondary hover:bg-bg-elevated'
            ]"
            title="Toggle AI Terminal"
          >
            <Terminal class="w-4 h-4" />
          </button>
        </div>
      </Surface>
    </div>

    <!-- Main Workspace Matrix -->
    <div class="flex-grow flex flex-row w-full min-h-0 overflow-hidden relative">
      <!-- Left Column: Persistent Rail + Sliding Spawner Panel -->
      <div class="h-full flex flex-row shrink-0 relative">
        <!-- Persistent Thin Vertical Sidebar Utility Rail -->
        <div class="w-12 h-full border-r border-border-default bg-bg-surface/40 flex flex-col items-center py-4 justify-between select-none shrink-0 z-30">
          <div class="flex flex-col items-center gap-4">
            <!-- Open Spawner button -->
            <button 
              @click="isSidebarDrawerOpen = !isSidebarDrawerOpen"
              :class="[
                'p-2 rounded-xl transition-all duration-200 cursor-pointer shadow-xs border',
                isSidebarDrawerOpen 
                  ? 'bg-bg-elevated text-text-primary border-border-elevated shadow-inner' 
                  : 'bg-bg-surface/60 border-border-default text-text-secondary hover:bg-bg-elevated'
              ]"
              title="Toggle Spawner Panel"
            >
              <Folder class="w-4 h-4" />
            </button>
            
            <!-- Quick Save button -->
            <button 
              @click="triggerQuickSave"
              class="p-2 rounded-xl border border-border-default bg-bg-surface/60 text-text-secondary hover:bg-bg-elevated hover:text-text-primary transition-all cursor-pointer shadow-xs"
              title="Quick Save Project"
            >
              <Save class="w-4 h-4" />
            </button>
          </div>
          
          <div class="flex flex-col items-center gap-4">
            <!-- Cloud Status Indicator -->
            <div 
              class="p-2 rounded-xl border border-border-default bg-bg-surface/60 text-text-secondary cursor-help shadow-xs"
              :title="diagramStore.savedDiagramsList.length > 0 ? 'Cloud database online' : 'Cloud storage offline'"
            >
              <Cloud class="w-4 h-4" :class="diagramStore.savedDiagramsList.length > 0 ? 'text-success' : 'text-text-muted'" />
            </div>
          </div>
        </div>

        <!-- Sliding Spawner Overlay Panel -->
        <div 
          class="h-full shrink-0 transition-all duration-300 ease-tactile overflow-hidden bg-bg-surface border-r border-border-default relative z-20"
          :style="{ width: isSidebarDrawerOpen ? sidebarWidth + 'px' : '0px' }"
        >
          <!-- Inner Fixed-Width Content Container -->
          <div :style="{ width: sidebarWidth + 'px' }" class="h-full flex flex-col">
            <div class="w-full flex-1 flex flex-col min-h-0">
              <!-- Dual-tab Header Bar -->
              <div class="flex items-center justify-between bg-bg-elevated text-text-primary select-none px-3 py-2 shrink-0 border-b border-border-default">
                <div class="flex items-center gap-1.5 flex-1 mr-2">
                  <!-- Toolbench Tab Button -->
                  <button 
                    @click="activeSidebarTab = 'tools'"
                    :class="[
                      'flex-1 text-center py-1.5 text-[11px] font-bold rounded-lg transition-all cursor-pointer',
                      activeSidebarTab === 'tools' 
                        ? 'bg-bg-base text-text-primary shadow-xs' 
                        : 'text-text-secondary hover:text-text-primary hover:bg-bg-surface'
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
                        ? 'bg-bg-base text-text-primary shadow-xs' 
                        : 'text-text-secondary hover:text-text-primary hover:bg-bg-surface'
                    ]"
                  >
                    Cloud Files
                  </button>
                </div>
                <!-- Close button -->
                <button @click="isSidebarDrawerOpen = false" class="p-1 text-text-secondary hover:text-text-primary transition-colors cursor-pointer rounded-lg hover:bg-bg-surface" title="Close Drawer">
                  <X class="w-4 h-4" />
                </button>
              </div>

              <!-- Conditional Tab Content Rendering -->
              <div v-if="activeSidebarTab === 'tools'" class="flex-1 flex flex-col min-h-0 overflow-y-auto">
                <Toolbar />
              </div>
              <div v-else class="flex-1 flex flex-col min-h-0 overflow-y-auto">
                <div class="p-4 border-b border-border-default flex-shrink-0">
                  <button 
                    @click="createNewCanvasAction" 
                    class="w-full py-2 bg-zinc-900 hover:bg-zinc-800 text-white text-xs font-semibold rounded-lg shadow-sm transition-all active:scale-98 cursor-pointer text-center"
                  >
                    New Clean Canvas
                  </button>
                </div>

                <div class="flex-1 overflow-y-auto px-2 pb-4 space-y-1 mt-2">
                  <div v-if="diagramStore.savedDiagramsList.length === 0" class="text-center text-text-muted text-[11px] p-8 italic font-mono">
                    No cloud storage records found.
                  </div>
                  
                  <!-- Saved Diagram Database Rows (Swipe-to-Reveal-Delete Pattern) -->
                  <div 
                    v-for="diag in diagramStore.savedDiagramsList" 
                    :key="diag.id"
                    class="relative h-[60px] mx-1 rounded-xl overflow-hidden bg-error shadow-sm"
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
                        'absolute inset-0 h-full p-3 transition-transform duration-300 ease-in-out cursor-pointer flex items-center justify-between border rounded-xl bg-bg-surface',
                        diagramStore.currentDiagramId === diag.id 
                          ? 'border-border-elevated text-text-primary' 
                          : 'border-border-default text-text-secondary hover:bg-bg-elevated',
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
                        class="p-1.5 text-zinc-400 hover:text-zinc-655 dark:text-zinc-500 dark:hover:text-zinc-300 rounded-lg hover:bg-bg-surface transition-colors cursor-pointer"
                        title="Options"
                      >
                        <MoreVertical class="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <!-- Resizable Sidebar Drag Handle inside left column at the right edge -->
          <div 
            @mousedown="startResize"
            class="absolute top-0 right-0 w-[2px] cursor-col-resize bg-transparent hover:bg-bg-elevated active:bg-border-elevated transition-colors h-full z-45 select-none"
          ></div>
        </div>
      </div>

      <!-- Center Column: Canvas Viewport -->
      <div class="flex-grow h-full min-w-0 relative">
        <!-- Main Drawing Area Viewport -->
        <div class="flex-grow w-full h-full relative bg-bg-canvas transition-all duration-300 overflow-hidden">
          <Canvas :onLogout="handleSignOutFlow" />
        </div>
        <!-- MiniMap overlay (bottom-right of the canvas viewport) -->
        <MiniMap />
      </div>

      <!-- Right Column: AI Terminal Outer Wrapper -->
      <div 
        class="h-full shrink-0 transition-all duration-300 ease-tactile overflow-hidden bg-bg-surface relative"
        :style="{ width: isTerminalOpen ? '32rem' : '2.5rem' }"
      >
        <!-- Inner Fixed-Width Content Container -->
        <div :style="{ width: isTerminalOpen ? '32rem' : '2.5rem' }" class="h-full">
          <TerminalEditor 
            :isExpanded="isTerminalOpen" 
            @toggle="isTerminalOpen = !isTerminalOpen"
            class="w-full h-full"
          />
        </div>
      </div>
    </div>

    <!-- Bottom: Unified Status Ribbon -->
    <StatusBar />

    <!-- Global Command Palette (⌘K / Ctrl+K) -->
    <CommandPalette @toggle-theme="toggleDarkMode" />

    <!-- Global Confirmation Modal Wrapper -->
    <transition name="fade">
      <div 
        v-if="diagramStore.globalModalConfig.isOpen" 
        class="fixed inset-0 z-[100] flex items-center justify-center p-4"
      >
        <div 
          class="absolute inset-0 bg-zinc-950/60 backdrop-blur-sm"
          @click="diagramStore.closeGlobalModal()"
        ></div>
        <div class="relative bg-bg-surface border border-border-elevated rounded-2xl shadow-2xl w-full max-w-sm overflow-hidden flex flex-col p-6 scale-100 transition-transform z-10">
          <h3 class="text-lg font-bold text-text-primary mb-2">{{ diagramStore.globalModalConfig.title }}</h3>
          <p class="text-sm text-text-secondary mb-6 leading-relaxed">{{ diagramStore.globalModalConfig.message }}</p>
          <div class="flex justify-end gap-3 mt-auto">
            <button 
              @click="diagramStore.closeGlobalModal()"
              class="px-4 py-2 text-xs font-semibold text-text-secondary bg-bg-elevated hover:bg-bg-surface hover:text-text-primary border border-border-default rounded-lg transition-all cursor-pointer hover:scale-[1.02] active:scale-[0.98]"
            >
              {{ diagramStore.globalModalConfig.cancelText }}
            </button>
            <button 
              @click="executeGlobalConfirm"
              class="px-4 py-2 text-xs font-semibold text-white bg-error hover:bg-error/90 rounded-lg transition-all shadow-sm cursor-pointer hover:scale-[1.02] active:scale-[0.98]"
            >
              {{ diagramStore.globalModalConfig.confirmText }}
            </button>
          </div>
        </div>
      </div>
    </transition>
  </Stack>
</template>

<script setup>
import { ref, onMounted, onUnmounted, computed } from 'vue';
import { useDiagramStore } from '../stores/diagramStore';
import { useAuthStore } from '../stores/authStore';
import Canvas from '../components/Canvas.vue';
import Toolbar from '../components/Toolbar.vue';
import TerminalEditor from '../components/TerminalEditor.vue';
import MiniMap from '../components/MiniMap.vue';
import Stack from '../components/ui/layout/Stack.vue';
import Surface from '../components/ui/layout/Surface.vue';
import StatusBar from '../components/ui/layout/StatusBar.vue';
import CommandPalette from '../components/CommandPalette.vue';
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
  Moon,
  Save,
  Cloud
} from 'lucide-vue-next';

const diagramStore = useDiagramStore();
const authStore = useAuthStore();

const isTerminalOpen = ref(false);
const isSidebarDrawerOpen = ref(true);
const activeSidebarTab = ref('tools');
const swipedRowId = ref(null);

// Resizable Sidebar Engine
const sidebarWidth = ref(Number(localStorage.getItem('sidebar_width')) || 200);
const isResizing = ref(false);

const startResize = (e) => {
  isResizing.value = true;
  document.addEventListener('mousemove', handleResize);
  document.addEventListener('mouseup', stopResize);
};

const handleResize = (e) => {
  if (!isResizing.value) return;
  // Constrain resizing between 200px and 450px after subtracting 48px rail width
  const calculatedWidth = e.clientX - 48;
  if (calculatedWidth >= 200 && calculatedWidth <= 450) {
    sidebarWidth.value = calculatedWidth;
  }
};

const stopResize = () => {
  isResizing.value = false;
  document.removeEventListener('mousemove', handleResize);
  document.removeEventListener('mouseup', stopResize);
  localStorage.setItem('sidebar_width', sidebarWidth.value);
};

const isDarkMode = ref(document.documentElement.classList.contains('dark'));
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

const triggerQuickSave = async () => {
  try {
    await diagramStore.saveCurrentDiagram(diagramStore.currentDiagramTitle || 'Untitled Diagram');
    diagramStore.setCompilerState({ status: 'success', message: 'Telemetry backup save transmission succeeded.' });
    setTimeout(() => {
      if (diagramStore.compilerStatus === 'success' && diagramStore.compilerMessage.includes('backup')) {
        diagramStore.setCompilerState({ status: 'idle', message: 'Ready for telemetry transmission...' });
      }
    }, 3000);
  } catch (err) {
    console.error(err);
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
  diagramStore.updateElementZIndex(inspectorElement.value.id, currentZ + delta);
}

function zoomIn() {
  if (diagramStore.zoomLevel < 2) {
    diagramStore.setZoomLevel(Math.min(2, diagramStore.zoomLevel + 0.1));
  }
}

function zoomOut() {
  if (diagramStore.zoomLevel > 0.5) {
    diagramStore.setZoomLevel(Math.max(0.5, diagramStore.zoomLevel - 0.1));
  }
}

function resetZoom() {
  diagramStore.setZoomLevel(1);
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
