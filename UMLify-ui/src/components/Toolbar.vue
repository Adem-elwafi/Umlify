<template>
  <!-- Floating Pill Dock -->
  <div class="absolute left-6 bottom-10 bg-white/80 backdrop-blur-md border border-zinc-200 shadow-xl shadow-zinc-200/30 rounded-2xl p-2 flex flex-col gap-1.5 z-50 w-13 items-center">
    
    <!-- Element Spawners -->
    <div 
      draggable="true"
      @dragstart="handleDragStart($event, 'actor')"
      class="w-9 h-9 flex items-center justify-center rounded-xl bg-zinc-50 hover:bg-zinc-100 border border-zinc-200/60 transition-all active:scale-95 cursor-grab group"
      title="Add Actor (Drag to Canvas)"
    >
      <User class="w-5 h-5 text-zinc-600 group-hover:text-zinc-900" />
    </div>
    
    <div 
      draggable="true"
      @dragstart="handleDragStart($event, 'usecase')"
      class="w-9 h-9 flex items-center justify-center rounded-xl bg-zinc-50 hover:bg-zinc-100 border border-zinc-200/60 transition-all active:scale-95 cursor-grab group"
      title="Add Use Case (Drag to Canvas)"
    >
      <CircleDot class="w-5 h-5 text-zinc-600 group-hover:text-zinc-900" />
    </div>

    <div 
      draggable="true"
      @dragstart="handleDragStart($event, 'System')"
      class="w-9 h-9 flex items-center justify-center rounded-xl bg-zinc-50 hover:bg-zinc-100 border border-zinc-200/60 transition-all active:scale-95 cursor-grab group"
      title="Add System Boundary (Drag to Canvas)"
    >
      <Box class="w-5 h-5 text-zinc-600 group-hover:text-zinc-900" />
    </div>

    <div class="w-6 h-px bg-zinc-200 my-0.5" />

    <!-- Local File Actions -->
    <button @click="emitLocalExport" class="w-9 h-9 flex items-center justify-center rounded-xl bg-zinc-50 hover:bg-zinc-100 border border-zinc-200/60 text-zinc-600 cursor-pointer transition-all group" title="Export JSON">
      <Download class="w-4 h-4 group-hover:text-zinc-900" />
    </button>
    <button @click="triggerFileInput" class="w-9 h-9 flex items-center justify-center rounded-xl bg-zinc-50 hover:bg-zinc-100 border border-zinc-200/60 text-zinc-600 cursor-pointer transition-all group" title="Import JSON">
      <Upload class="w-4 h-4 group-hover:text-zinc-900" />
    </button>
    <button @click="emitLocalSnapshot" class="w-9 h-9 flex items-center justify-center rounded-xl bg-zinc-50 hover:bg-zinc-100 border border-zinc-200/60 text-zinc-600 cursor-pointer transition-all group" title="PNG Snapshot">
      <Camera class="w-4 h-4 group-hover:text-zinc-900" />
    </button>
    
    <div class="w-6 h-px bg-zinc-200 my-0.5" />

    <!-- Sign Out -->
    <button @click="handleLogOutFlow" class="w-9 h-9 flex items-center justify-center rounded-xl bg-rose-50 hover:bg-rose-100 border border-rose-200/60 text-rose-600 cursor-pointer transition-all group" title="Sign Out">
      <LogOut class="w-4 h-4 group-hover:text-rose-700" />
    </button>
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
</script>

<style scoped>
.fade-enter-active, .fade-leave-active { transition: opacity 0.2s ease; }
.fade-enter-from, .fade-leave-to { opacity: 0; }
</style>
