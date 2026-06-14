<script setup>
import { ref } from 'vue';
import { useDiagramStore } from '../stores/diagramStore';
import { useAuthStore } from '../stores/authStore';

// Two-way binding for the selected connection type
const selectedType = defineModel();

const emit = defineEmits(['local-export', 'local-import', 'local-snapshot']);

const diagramStore = useDiagramStore();
const authStore = useAuthStore();
const fileLoader = ref(null);

const handleCloudSave = async () => {
  await diagramStore.saveCurrentDiagram(diagramStore.currentDiagramTitle);
};

const triggerFileInput = () => {
  fileLoader.value?.click();
};

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

<template>
  <div class="w-full min-h-[60px] bg-[#1a1a1e] border-t border-gray-800 p-4 flex flex-wrap items-center justify-between gap-4 select-none shadow-[0_-4px_20px_rgba(0,0,0,0.2)] z-50">
    
    <div class="flex items-center space-x-2">
      <button 
        @click="diagramStore.addActor()" 
        class="bg-[#26262b] border border-gray-700 hover:border-gray-600 text-gray-200 text-xs font-semibold px-3 py-1.5 rounded-lg active:scale-95 transition-all cursor-pointer"
      >
        👤 Actor
      </button>
      <button 
        @click="diagramStore.addUseCase()" 
        class="bg-[#26262b] border border-gray-700 hover:border-gray-600 text-gray-200 text-xs font-semibold px-3 py-1.5 rounded-lg active:scale-95 transition-all cursor-pointer"
      >
        ⭕ Use Case
      </button>
      <button 
        @click="diagramStore.addSystem()" 
        class="bg-[#26262b] border border-gray-700 hover:border-gray-600 text-gray-200 text-xs font-semibold px-3 py-1.5 rounded-lg active:scale-95 transition-all cursor-pointer"
      >
        🔲 System
      </button>
      
      <div class="h-6 w-px bg-gray-700 mx-2" />
      
      <button 
        @click="diagramStore.connectMode = !diagramStore.connectMode" 
        :class="[
          'border text-xs font-semibold px-3 py-1.5 rounded-lg active:scale-95 transition-all cursor-pointer', 
          diagramStore.connectMode ? 'bg-indigo-600 border-indigo-500 text-white shadow-md' : 'bg-[#26262b] border-gray-700 hover:border-gray-600 text-gray-200'
        ]"
      >
        {{ diagramStore.connectMode ? '✏️ Connecting...' : '🔗 Link Line Mode' }}
      </button>

      <select 
        v-if="diagramStore.connectMode" 
        v-model="selectedType" 
        class="bg-[#26262b] border border-gray-700 text-xs text-gray-200 rounded px-2 py-1.5 focus:outline-none focus:border-indigo-500 cursor-pointer"
      >
        <option value="association">Association</option>
        <option value="include">&lt;&lt;include&gt;&gt;</option>
        <option value="extend">&lt;&lt;extend&gt;&gt;</option>
        <option value="generalization">Generalization</option>
        <option value="dependency">Dependency</option>
      </select>
    </div>

    <div class="flex items-center space-x-3 bg-[#26262b] px-3 py-1.5 rounded-lg border border-gray-700/60">
      <input 
        v-model="diagramStore.currentDiagramTitle"
        type="text"
        placeholder="Untitled Diagram"
        class="bg-transparent border-none text-xs text-white font-medium focus:outline-none w-44 placeholder-gray-500"
      />
      <button 
        @click="handleCloudSave"
        class="bg-indigo-600 hover:bg-indigo-500 active:scale-95 text-white text-xs font-semibold px-3 py-1 rounded shadow-md transition-all flex items-center space-x-1 cursor-pointer"
      >
        <span>💾</span>
        <span>Save Project</span>
      </button>

      <transition name="fade">
        <span 
          v-if="diagramStore.globalSaveStatusMessage" 
          :class="['text-[11px] font-mono tracking-wide font-bold px-1.5 py-0.5 rounded', 
            diagramStore.globalSaveStatusMessage.includes('Successful') ? 'text-emerald-400 bg-emerald-950/40' : 'text-amber-400 bg-amber-950/30'
          ]"
        >
          {{ diagramStore.globalSaveStatusMessage }}
        </span>
      </transition>
    </div>

    <div class="flex items-center space-x-2">
      <button @click="emitLocalExport" class="bg-transparent hover:bg-gray-800 text-xs px-2.5 py-1.5 rounded font-medium text-gray-300 transition-all cursor-pointer" title="Download Local JSON Schema">Export JSON</button>
      <button @click="triggerFileInput" class="bg-transparent hover:bg-gray-800 text-xs px-2.5 py-1.5 rounded font-medium text-gray-300 transition-all cursor-pointer" title="Load Local JSON File">Import JSON</button>
      <button @click="emitLocalSnapshot" class="bg-transparent hover:bg-gray-800 text-xs px-2.5 py-1.5 rounded font-medium text-gray-300 transition-all cursor-pointer" title="Capture PNG Viewport">PNG Snapshot</button>
      <input type="file" ref="fileLoader" @change="handleFileImport" class="hidden" accept=".json" />
      
      <div class="h-6 w-px bg-gray-700 mx-2" />
      
      <button @click="handleLogOutFlow" class="bg-rose-600/10 hover:bg-rose-600/20 text-rose-400 border border-rose-900/40 px-3 py-1.5 rounded text-xs font-semibold tracking-wide transition-all cursor-pointer">
        Sign Out
      </button>
    </div>
  </div>
</template>

<style scoped>
.fade-enter-active, .fade-leave-active { transition: opacity 0.2s ease; }
.fade-enter-from, .fade-leave-to { opacity: 0; }
</style>