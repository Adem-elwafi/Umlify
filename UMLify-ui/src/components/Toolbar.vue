<template>
  <!-- Floating engineered vertical panel -->
  <div class="absolute left-6 bottom-10 bg-primary-slate border border-secondary-gray/20 shadow-2xl rounded-2xl p-2.5 flex flex-col gap-2 z-50 w-14 items-center text-white">
    
    <!-- CLUSTER A: UML Structural Entities -->
    <div class="flex flex-col gap-2 items-center w-full">
      <!-- Actor -->
      <div class="relative group/tooltip flex items-center justify-center">
        <div 
          draggable="true"
          @dragstart="handleDragStart($event, 'actor')"
          class="w-9 h-9 flex items-center justify-center rounded-xl bg-white/10 hover:bg-white/20 border border-white/10 text-white/80 hover:text-white transition-all active:scale-95 cursor-grab"
        >
          <User class="w-5 h-5" />
        </div>
        <div class="absolute left-full ml-3 px-2 py-1 bg-zinc-950/90 border border-zinc-800 text-white text-[10px] font-bold rounded-lg shadow-xl opacity-0 pointer-events-none group-hover/tooltip:opacity-100 transition-all duration-200 whitespace-nowrap z-50 translate-x-1 group-hover/tooltip:translate-x-0">
          Actor (Drag to Canvas)
        </div>
      </div>

      <!-- Use Case -->
      <div class="relative group/tooltip flex items-center justify-center">
        <div 
          draggable="true"
          @dragstart="handleDragStart($event, 'usecase')"
          class="w-9 h-9 flex items-center justify-center rounded-xl bg-white/10 hover:bg-white/20 border border-white/10 text-white/80 hover:text-white transition-all active:scale-95 cursor-grab"
        >
          <CircleDot class="w-5 h-5" />
        </div>
        <div class="absolute left-full ml-3 px-2 py-1 bg-zinc-950/90 border border-zinc-800 text-white text-[10px] font-bold rounded-lg shadow-xl opacity-0 pointer-events-none group-hover/tooltip:opacity-100 transition-all duration-200 whitespace-nowrap z-50 translate-x-1 group-hover/tooltip:translate-x-0">
          Use Case (Drag to Canvas)
        </div>
      </div>

      <!-- System Boundary -->
      <div class="relative group/tooltip flex items-center justify-center">
        <div 
          draggable="true"
          @dragstart="handleDragStart($event, 'System')"
          class="w-9 h-9 flex items-center justify-center rounded-xl bg-white/10 hover:bg-white/20 border border-white/10 text-white/80 hover:text-white transition-all active:scale-95 cursor-grab"
        >
          <Box class="w-5 h-5" />
        </div>
        <div class="absolute left-full ml-3 px-2 py-1 bg-zinc-950/90 border border-zinc-800 text-white text-[10px] font-bold rounded-lg shadow-xl opacity-0 pointer-events-none group-hover/tooltip:opacity-100 transition-all duration-200 whitespace-nowrap z-50 translate-x-1 group-hover/tooltip:translate-x-0">
          System Boundary (Drag to Canvas)
        </div>
      </div>

      <!-- Package Container -->
      <div class="relative group/tooltip flex items-center justify-center">
        <div 
          draggable="true"
          @dragstart="handleDragStart($event, 'package')"
          class="w-9 h-9 flex items-center justify-center rounded-xl bg-white/10 hover:bg-white/20 border border-white/10 text-white/80 hover:text-white transition-all active:scale-95 cursor-grab"
        >
          <FolderArchive class="w-5 h-5" />
        </div>
        <div class="absolute left-full ml-3 px-2 py-1 bg-zinc-950/90 border border-zinc-800 text-white text-[10px] font-bold rounded-lg shadow-xl opacity-0 pointer-events-none group-hover/tooltip:opacity-100 transition-all duration-200 whitespace-nowrap z-50 translate-x-1 group-hover/tooltip:translate-x-0">
          Package Container (Drag to Canvas)
        </div>
      </div>

      <!-- Note Node -->
      <div class="relative group/tooltip flex items-center justify-center">
        <div 
          draggable="true"
          @dragstart="handleDragStart($event, 'note')"
          class="w-9 h-9 flex items-center justify-center rounded-xl bg-white/10 hover:bg-white/20 border border-white/10 text-white/80 hover:text-white transition-all active:scale-95 cursor-grab"
        >
          <StickyNote class="w-5 h-5" />
        </div>
        <div class="absolute left-full ml-3 px-2 py-1 bg-zinc-950/90 border border-zinc-800 text-white text-[10px] font-bold rounded-lg shadow-xl opacity-0 pointer-events-none group-hover/tooltip:opacity-100 transition-all duration-200 whitespace-nowrap z-50 translate-x-1 group-hover/tooltip:translate-x-0">
          Note Node (Drag to Canvas)
        </div>
      </div>
    </div>

    <!-- Crisp Separator line bounded by secondary-gray token -->
    <div class="w-8 h-px bg-secondary-gray/20 my-1" />

    <!-- CLUSTER B: Active Canvas Utilities -->
    <div class="flex flex-col gap-2 items-center w-full">
      <!-- Link Vector Spawner -->
      <div class="relative group/tooltip flex items-center justify-center">
        <button 
          @click="handleLinkSpawnerClick"
          class="w-9 h-9 flex items-center justify-center rounded-xl bg-white/10 hover:bg-white/20 border border-white/10 text-white/80 hover:text-white cursor-pointer transition-all active:scale-95"
        >
          <ArrowUpRight class="w-5 h-5" />
        </button>
        <div class="absolute left-full ml-3 px-2 py-1 bg-zinc-950/90 border border-zinc-800 text-white text-[10px] font-bold rounded-lg shadow-xl opacity-0 pointer-events-none group-hover/tooltip:opacity-100 transition-all duration-200 whitespace-nowrap z-50 translate-x-1 group-hover/tooltip:translate-x-0">
          Quick Link (Select 2 elements to connect)
        </div>
      </div>

      <!-- Standalone Text Annotation Tool -->
      <div class="relative group/tooltip flex items-center justify-center">
        <button 
          @click="handleTextAnnotationClick"
          class="w-9 h-9 flex items-center justify-center rounded-xl bg-white/10 hover:bg-white/20 border border-white/10 text-white/80 hover:text-white cursor-pointer transition-all active:scale-95"
        >
          <Type class="w-5 h-5" />
        </button>
        <div class="absolute left-full ml-3 px-2 py-1 bg-zinc-950/90 border border-zinc-800 text-white text-[10px] font-bold rounded-lg shadow-xl opacity-0 pointer-events-none group-hover/tooltip:opacity-100 transition-all duration-200 whitespace-nowrap z-50 translate-x-1 group-hover/tooltip:translate-x-0">
          Add Standalone Note
        </div>
      </div>

      <!-- Instantaneous Clear Canvas -->
      <div class="relative group/tooltip flex items-center justify-center">
        <button 
          @click="handleClearCanvas"
          class="w-9 h-9 flex items-center justify-center rounded-xl bg-rose-950/50 hover:bg-rose-900 border border-rose-900/50 text-rose-200 hover:text-white cursor-pointer transition-all active:scale-95"
        >
          <Trash2 class="w-5 h-5" />
        </button>
        <div class="absolute left-full ml-3 px-2 py-1 bg-zinc-950/90 border border-zinc-800 text-white text-[10px] font-bold rounded-lg shadow-xl opacity-0 pointer-events-none group-hover/tooltip:opacity-100 transition-all duration-200 whitespace-nowrap z-50 translate-x-1 group-hover/tooltip:translate-x-0">
          Clear Canvas
        </div>
      </div>
    </div>

    <!-- Crisp Separator line -->
    <div class="w-8 h-px bg-secondary-gray/20 my-1" />

    <!-- CLUSTER C: Local File Actions -->
    <div class="flex flex-col gap-2 items-center w-full">
      <!-- Export JSON -->
      <div class="relative group/tooltip flex items-center justify-center">
        <button @click="emitLocalExport" class="w-9 h-9 flex items-center justify-center rounded-xl bg-white/10 hover:bg-white/20 border border-white/10 text-white/80 hover:text-white cursor-pointer transition-all active:scale-95">
          <Download class="w-4 h-4" />
        </button>
        <div class="absolute left-full ml-3 px-2 py-1 bg-zinc-950/90 border border-zinc-800 text-white text-[10px] font-bold rounded-lg shadow-xl opacity-0 pointer-events-none group-hover/tooltip:opacity-100 transition-all duration-200 whitespace-nowrap z-50 translate-x-1 group-hover/tooltip:translate-x-0">
          Export JSON
        </div>
      </div>

      <!-- Import JSON -->
      <div class="relative group/tooltip flex items-center justify-center">
        <button @click="triggerFileInput" class="w-9 h-9 flex items-center justify-center rounded-xl bg-white/10 hover:bg-white/20 border border-white/10 text-white/80 hover:text-white cursor-pointer transition-all active:scale-95">
          <Upload class="w-4 h-4" />
        </button>
        <div class="absolute left-full ml-3 px-2 py-1 bg-zinc-950/90 border border-zinc-800 text-white text-[10px] font-bold rounded-lg shadow-xl opacity-0 pointer-events-none group-hover/tooltip:opacity-100 transition-all duration-200 whitespace-nowrap z-50 translate-x-1 group-hover/tooltip:translate-x-0">
          Import JSON
        </div>
      </div>

      <!-- PNG Snapshot -->
      <div class="relative group/tooltip flex items-center justify-center">
        <button @click="emitLocalSnapshot" class="w-9 h-9 flex items-center justify-center rounded-xl bg-white/10 hover:bg-white/20 border border-white/10 text-white/80 hover:text-white cursor-pointer transition-all active:scale-95">
          <Camera class="w-4 h-4" />
        </button>
        <div class="absolute left-full ml-3 px-2 py-1 bg-zinc-950/90 border border-zinc-800 text-white text-[10px] font-bold rounded-lg shadow-xl opacity-0 pointer-events-none group-hover/tooltip:opacity-100 transition-all duration-200 whitespace-nowrap z-50 translate-x-1 group-hover/tooltip:translate-x-0">
          PNG Snapshot
        </div>
      </div>
    </div>

    <!-- Crisp Separator line -->
    <div class="w-8 h-px bg-secondary-gray/20 my-1" />

    <!-- CLUSTER D: Sign Out -->
    <div class="flex flex-col gap-2 items-center w-full">
      <div class="relative group/tooltip flex items-center justify-center">
        <button @click="handleLogOutFlow" class="w-9 h-9 flex items-center justify-center rounded-xl bg-rose-950/40 hover:bg-rose-900 border border-rose-900/40 text-rose-300 hover:text-white cursor-pointer transition-all active:scale-95">
          <LogOut class="w-4 h-4" />
        </button>
        <div class="absolute left-full ml-3 px-2 py-1 bg-zinc-950/90 border border-zinc-800 text-white text-[10px] font-bold rounded-lg shadow-xl opacity-0 pointer-events-none group-hover/tooltip:opacity-100 transition-all duration-200 whitespace-nowrap z-50 translate-x-1 group-hover/tooltip:translate-x-0">
          Sign Out
        </div>
      </div>
    </div>
  </div>

  <!-- Project Controls Panel (Floating next to the element dock) -->
  <div class="absolute left-24 bottom-10 bg-white/90 backdrop-blur-md border border-zinc-200 shadow-xl shadow-zinc-200/20 rounded-2xl p-4 flex flex-col gap-3 z-50 w-48 transition-all duration-300">
    <div class="flex flex-col gap-1">
      <label class="text-[9px] uppercase tracking-wider text-zinc-400 font-bold px-1">Diagram Title</label>
      <input 
        v-model="diagramStore.currentDiagramTitle"
        type="text"
        placeholder="Untitled Diagram"
        class="bg-transparent border-none text-[11px] text-zinc-900 font-semibold focus:outline-none placeholder-zinc-300 w-full px-1"
      />
    </div>

    <div class="h-px bg-zinc-100 w-full" />

    <div class="flex flex-col gap-2">
      <button 
        @click="handleCloudSave"
        class="bg-zinc-900 hover:bg-black text-white text-[11px] font-bold py-2 rounded-xl shadow-lg shadow-zinc-200 transition-all active:scale-95 cursor-pointer flex items-center justify-center gap-2"
      >
        <Save class="w-3.5 h-3.5" /> Save Project
      </button>
      
      <transition name="fade">
        <div 
          v-if="diagramStore.globalSaveStatusMessage" 
          class="text-[10px] font-medium px-2 py-1.5 rounded-lg flex items-center gap-1.5"
          :class="diagramStore.globalSaveStatusMessage.includes('Successful') ? 'text-emerald-600 bg-emerald-50 border border-emerald-100' : 'text-amber-600 bg-amber-50 border border-amber-100'"
        >
          <span class="text-xs">{{ diagramStore.globalSaveStatusMessage.includes('Successful') ? '✓' : '⚠️' }}</span>
          {{ diagramStore.globalSaveStatusMessage }}
        </div>
      </transition>
    </div>
  </div>

  <input type="file" ref="fileLoader" @change="handleFileImport" class="hidden" accept=".json" />
</template>

<script setup>
import { ref } from 'vue';
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

const emit = defineEmits(['local-export', 'local-import', 'local-snapshot']);

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
      const parsedData = JSON.parse(event.target.result);
      emit('local-import', parsedData);
    } catch (err) {
      alert('Invalid document syntax rules detected.');
    }
  };
  reader.readAsText(file);
};

const emitLocalExport = () => emit('local-export');
const emitLocalSnapshot = () => emit('local-snapshot');

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
  diagramStore.addNote();
};

const handleClearCanvas = () => {
  diagramStore.resetDiagram();
};
</script>

<style scoped>
.fade-enter-active, .fade-leave-active { transition: opacity 0.2s ease; }
.fade-enter-from, .fade-leave-to { opacity: 0; }
</style>
