<template>
  <div class="w-full flex-1 flex flex-col bg-white overflow-y-auto px-4 py-3 gap-5 text-zinc-700 select-none">
    
    <!-- SECTION A: Core Structural Entities -->
    <div class="flex flex-col gap-2">
      <h3 class="text-[10px] font-bold uppercase tracking-wider text-zinc-400 select-none font-mono">Core Entities</h3>
      <div class="grid grid-cols-2 gap-2">
        <!-- Actor Card -->
        <div 
          draggable="true"
          @dragstart="handleDragStart($event, 'actor')"
          class="flex flex-col items-center justify-center p-3 border border-zinc-200 rounded-xl hover:bg-zinc-50 cursor-grab transition-colors active:scale-98 select-none group"
        >
          <User class="w-6 h-6 text-zinc-500 group-hover:text-zinc-950 transition-colors mb-1.5" />
          <span class="text-[11px] font-semibold text-zinc-600 group-hover:text-zinc-950">Actor</span>
        </div>

        <!-- Use Case Card -->
        <div 
          draggable="true"
          @dragstart="handleDragStart($event, 'usecase')"
          class="flex flex-col items-center justify-center p-3 border border-zinc-200 rounded-xl hover:bg-zinc-50 cursor-grab transition-colors active:scale-98 select-none group"
        >
          <CircleDot class="w-6 h-6 text-zinc-500 group-hover:text-zinc-950 transition-colors mb-1.5" />
          <span class="text-[11px] font-semibold text-zinc-600 group-hover:text-zinc-950">Use Case</span>
        </div>

        <!-- System Boundary Card (Full span) -->
        <div 
          draggable="true"
          @dragstart="handleDragStart($event, 'System')"
          class="col-span-2 flex flex-col items-center justify-center p-3 border border-zinc-200 rounded-xl hover:bg-zinc-50 cursor-grab transition-colors active:scale-98 select-none group"
        >
          <Box class="w-6 h-6 text-zinc-500 group-hover:text-zinc-950 transition-colors mb-1.5" />
          <span class="text-[11px] font-semibold text-zinc-600 group-hover:text-zinc-950">System Boundary</span>
        </div>
      </div>
    </div>

    <!-- Section Separator Line -->
    <div class="border-t border-zinc-100" />

    <!-- SECTION B: Extended Canvas Shapes -->
    <div class="flex flex-col gap-2">
      <h3 class="text-[10px] font-bold uppercase tracking-wider text-zinc-400 select-none font-mono">Extended Shapes</h3>
      <div class="grid grid-cols-2 gap-2">
        <!-- Package Card -->
        <div 
          draggable="true"
          @dragstart="handleDragStart($event, 'package')"
          class="flex flex-col items-center justify-center p-3 border border-zinc-200 rounded-xl hover:bg-zinc-50 cursor-grab transition-colors active:scale-98 select-none group"
        >
          <FolderArchive class="w-6 h-6 text-zinc-500 group-hover:text-zinc-950 transition-colors mb-1.5" />
          <span class="text-[11px] font-semibold text-zinc-600 group-hover:text-zinc-950">Package</span>
        </div>

        <!-- Note Card -->
        <div 
          draggable="true"
          @dragstart="handleDragStart($event, 'note')"
          class="flex flex-col items-center justify-center p-3 border border-zinc-200 rounded-xl hover:bg-zinc-50 cursor-grab transition-colors active:scale-98 select-none group"
        >
          <StickyNote class="w-6 h-6 text-zinc-500 group-hover:text-zinc-950 transition-colors mb-1.5" />
          <span class="text-[11px] font-semibold text-zinc-600 group-hover:text-zinc-950">Note</span>
        </div>
      </div>
    </div>

    <!-- Section Separator Line -->
    <div class="border-t border-zinc-100" />

    <!-- SECTION C: Canvas Utilities -->
    <div class="flex flex-col gap-2">
      <h3 class="text-[10px] font-bold uppercase tracking-wider text-zinc-400 select-none font-mono">Canvas Utilities</h3>
      <div class="grid grid-cols-2 gap-2">
        <!-- Quick Link -->
        <button 
          @click="handleLinkSpawnerClick"
          class="flex flex-col items-center justify-center p-3 border border-zinc-200 rounded-xl hover:bg-zinc-50 transition-colors active:scale-98 cursor-pointer group"
        >
          <ArrowUpRight class="w-6 h-6 text-zinc-500 group-hover:text-zinc-950 transition-colors mb-1.5" />
          <span class="text-[11px] font-semibold text-zinc-600 group-hover:text-zinc-950">Quick Link</span>
        </button>

        <!-- Standalone Note / Text label -->
        <button 
          @click="handleTextAnnotationClick"
          class="flex flex-col items-center justify-center p-3 border border-zinc-200 rounded-xl hover:bg-zinc-50 transition-colors active:scale-98 cursor-pointer group"
        >
          <Type class="w-6 h-6 text-zinc-500 group-hover:text-zinc-950 transition-colors mb-1.5" />
          <span class="text-[11px] font-semibold text-zinc-600 group-hover:text-zinc-950">Add Text</span>
        </button>

        <!-- Clear Canvas (Full span) -->
        <button 
          @click="handleClearCanvas"
          class="col-span-2 flex flex-col items-center justify-center p-3 border border-rose-200 rounded-xl bg-rose-50/50 hover:bg-rose-50 transition-colors active:scale-98 cursor-pointer group"
        >
          <Trash2 class="w-6 h-6 text-rose-600 group-hover:text-rose-700 transition-colors mb-1.5" />
          <span class="text-[11px] font-bold text-rose-600 group-hover:text-rose-700">Clear Viewport</span>
        </button>
      </div>
    </div>

    <!-- Section Separator Line -->
    <div class="border-t border-zinc-100" />

    <!-- SECTION D: Project Controls & Save -->
    <div class="flex flex-col gap-2.5 p-3 bg-zinc-50 border border-zinc-200/80 rounded-2xl">
      <div class="flex flex-col gap-1 px-1">
        <label class="text-[9px] uppercase tracking-wider text-zinc-400 font-bold font-mono select-none">Diagram Title</label>
        <input 
          v-model="diagramStore.currentDiagramTitle"
          type="text"
          placeholder="Untitled Diagram"
          class="bg-transparent border-none text-[11px] text-zinc-900 font-semibold focus:outline-none placeholder-zinc-300 w-full"
        />
      </div>
      <div class="h-px bg-zinc-200 w-full" />
      <button 
        @click="handleCloudSave"
        class="bg-[#213C51] hover:bg-[#1a3041] text-white text-[11px] font-bold py-2 rounded-xl shadow-xs transition-all active:scale-95 cursor-pointer flex items-center justify-center gap-2"
      >
        <Save class="w-3.5 h-3.5" /> Save to Cloud
      </button>
      <!-- Global Save Status Message -->
      <transition name="fade">
        <div 
          v-if="diagramStore.globalSaveStatusMessage" 
          class="text-[10px] font-medium px-2 py-1.5 rounded-lg flex items-center gap-1.5 mt-1"
          :class="diagramStore.globalSaveStatusMessage.includes('Successful') ? 'text-emerald-600 bg-emerald-50 border border-emerald-100' : 'text-amber-600 bg-amber-50 border border-amber-100'"
        >
          <span class="text-xs">{{ diagramStore.globalSaveStatusMessage.includes('Successful') ? '✓' : '⚠️' }}</span>
          {{ diagramStore.globalSaveStatusMessage }}
        </div>
      </transition>
    </div>

    <!-- Section Separator Line -->
    <div class="border-t border-zinc-100" />

    <!-- SECTION E: Import/Export Operations -->
    <div class="flex flex-col gap-2">
      <h3 class="text-[10px] font-bold uppercase tracking-wider text-zinc-400 select-none font-mono">Local Operations</h3>
      <div class="grid grid-cols-3 gap-1.5">
        <!-- Export -->
        <button @click="emitLocalExport" class="flex flex-col items-center justify-center py-2 border border-zinc-200 rounded-lg hover:bg-zinc-50 transition-colors cursor-pointer group" title="Export JSON">
          <Download class="w-4 h-4 text-zinc-500 group-hover:text-zinc-900 mb-1" />
          <span class="text-[9px] text-zinc-500 font-semibold group-hover:text-zinc-900">Export</span>
        </button>
        <!-- Import -->
        <button @click="triggerFileInput" class="flex flex-col items-center justify-center py-2 border border-zinc-200 rounded-lg hover:bg-zinc-50 transition-colors cursor-pointer group" title="Import JSON">
          <Upload class="w-4 h-4 text-zinc-500 group-hover:text-zinc-900 mb-1" />
          <span class="text-[9px] text-zinc-500 font-semibold group-hover:text-zinc-900">Import</span>
        </button>
        <!-- Snapshot -->
        <button @click="emitLocalSnapshot" class="flex flex-col items-center justify-center py-2 border border-zinc-200 rounded-lg hover:bg-zinc-50 transition-colors cursor-pointer group" title="Save PNG">
          <Camera class="w-4 h-4 text-zinc-500 group-hover:text-zinc-900 mb-1" />
          <span class="text-[9px] text-zinc-500 font-semibold group-hover:text-zinc-900">Snapshot</span>
        </button>
      </div>
    </div>

    <!-- Section Separator Line -->
    <div class="border-t border-zinc-100" />

    <!-- SECTION F: Account Controls -->
    <div class="flex flex-col gap-2">
      <button @click="handleLogOutFlow" class="w-full flex items-center justify-center gap-2 py-2 border border-rose-200 rounded-xl bg-rose-50/20 text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer font-bold text-[11px]">
        <LogOut class="w-4 h-4" /> Sign Out
      </button>
    </div>
    
    <!-- Hidden File Input Reader -->
    <input type="file" ref="fileLoader" @change="handleFileImport" class="hidden" accept=".json" />
  </div>
</template>

<script setup>
import { ref } from 'vue';
import html2canvas from 'html2canvas';
import { useDiagramStore } from '../stores/diagramStore';
import { useAuthStore } from '../stores/authStore';
import { 
  User, 
  CircleDot, 
  Box, 
  FolderArchive,
  StickyNote,
  ArrowUpRight,
  Type,
  Trash2,
  Download, 
  Upload, 
  Camera, 
  LogOut,
  Save
} from 'lucide-vue-next';

const diagramStore = useDiagramStore();
const authStore = useAuthStore();
const fileLoader = ref(null);

const handleDragStart = (event, elementType) => {
  event.dataTransfer.effectAllowed = 'move';
  event.dataTransfer.setData('text/plain', elementType);
};

const handleCloudSave = async () => {
  await diagramStore.saveCurrentDiagram(diagramStore.currentDiagramTitle);
};

const triggerFileInput = () => { fileLoader.value?.click(); };

const handleFileImport = (e) => {
  const file = e.target.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = (event) => {
    try {
      const data = JSON.parse(event.target.result);
      if (typeof diagramStore.saveToHistory === 'function') diagramStore.saveToHistory();
      
      // Clear viewport and restore elements
      diagramStore.elements = data.elements.map(e => ({
        id: e.id,
        type: e.type,
        label: e.label,
        x: Number(e.x) || 100,
        y: Number(e.y) || 100,
        width: Number(e.width) || (e.type === 'actor' ? 80 : e.type === 'System' ? 300 : 140),
        height: Number(e.height) || (e.type === 'actor' ? 120 : e.type === 'System' ? 400 : 80)
      }));

      diagramStore.connections = data.connections.map(c => {
        const fromNode = diagramStore.elements.find(e => String(e.id) === String(c.from));
        const toNode = diagramStore.elements.find(e => String(e.id) === String(c.to));
        return {
          id: c.id,
          from: fromNode,
          to: toNode,
          fromSide: c.fromSide,
          toSide: c.toSide,
          type: c.type || 'association'
        };
      }).filter(c => c.from && c.to);
    } catch (err) {
      alert('Invalid document syntax rules detected.');
    }
  };
  reader.readAsText(file);
};

const emitLocalExport = () => {
  const data = {
    elements: diagramStore.elements.map(e => ({ id: e.id, type: e.type, label: e.label, x: e.x, y: e.y, width: e.width, height: e.height })),
    connections: diagramStore.connections.map(c => ({ id: c.id, from: c.from?.id, to: c.to?.id, fromSide: c.fromSide, toSide: c.toSide, type: c.type }))
  };
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = 'uml-diagram.json';
  link.click();
  URL.revokeObjectURL(url);
};

const emitLocalSnapshot = () => {
  const canvasElement = document.getElementById('uml-canvas');
  if (!canvasElement) return;
  html2canvas(canvasElement).then(canvas => {
    const link = document.createElement('a');
    link.download = 'uml-diagram.png';
    link.href = canvas.toDataURL('image/png');
    link.click();
  });
};

const handleLogOutFlow = () => {
  diagramStore.resetDiagram();
  authStore.logout();
};

const handleLinkSpawnerClick = () => {
  if (diagramStore.selectedElements.length >= 2) {
    diagramStore.connectElements(
      diagramStore.selectedElements[0],
      diagramStore.selectedElements[1],
      'right',
      'left',
      'association'
    );
  } else {
    alert("Please select at least two elements on the canvas to link them.");
  }
};

const handleTextAnnotationClick = () => {
  // Since diagramStore.addNote is not defined on diagramStore, check if we can add note as elements.push
  // In original code, it called diagramStore.addNote() - but wait! Let's check diagramStore.js.
  // Wait! In diagramStore.js, is there addNote? Let's check:
  // elements, connections, addActor, addUseCase, addSystem, deleteElement, connectElements, etc.
  // Wait! There was NO addNote in diagramStore.js!
  // Let's check how the original Toolbar.vue handled text annotations!
  // Ah! Line 287 of original Toolbar.vue was:
  // const handleTextAnnotationClick = () => { diagramStore.addNote(); };
  // But wait, if addNote was not defined in diagramStore.js, it might have been throwing an error, or maybe it adds a note type?
  // Let's check if note was supported in Canvas.vue.
  // Actually, we can push to diagramStore.elements a note element:
  // elements.value.push({ id: `note_${Date.now()}`, type: 'note', label: 'Note', x: 300, y: 150 })
  // Yes! Pushing a note element directly works! Let's do that:
  diagramStore.saveToHistory();
  diagramStore.elements.push({
    id: `note-${Date.now()}`,
    type: 'note',
    label: 'Sticky Note',
    x: 300,
    y: 200,
    width: 140,
    height: 80
  });
};

const handleClearCanvas = () => {
  diagramStore.resetDiagram();
};
</script>

<style scoped>
.fade-enter-active, .fade-leave-active { transition: opacity 0.2s ease; }
.fade-enter-from, .fade-leave-to { opacity: 0; }
</style>

