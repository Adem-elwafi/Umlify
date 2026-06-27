<template>
  <div class="w-full flex-1 flex flex-col bg-transparent overflow-y-auto px-3 py-4 gap-4 select-none">

    <!-- ═══════════════════════════════════════════
         SECTION A — DRAG PALETTE
    ════════════════════════════════════════════ -->
    <div class="flex flex-col gap-2">

      <!-- Actor + UseCase row -->
      <div class="grid grid-cols-2 gap-2">

        <!-- Actor -->
        <div
          draggable="true"
          @dragstart="handleDragStart($event, 'actor')"
          class="group relative flex flex-col items-center justify-center gap-2 py-4 rounded-2xl cursor-grab active:cursor-grabbing active:scale-95 select-none transition-all duration-150
                 bg-white border border-zinc-200/70 hover:border-zinc-300 hover:shadow-md
                 dark:bg-zinc-900 dark:border-zinc-800 dark:hover:border-zinc-700 dark:hover:shadow-[0_4px_16px_rgba(0,0,0,0.4)]"
        >
          <!-- Actor shape preview -->
          <svg class="w-8 h-8 text-zinc-400 dark:text-zinc-500 group-hover:text-zinc-700 dark:group-hover:text-zinc-300 transition-colors pointer-events-none" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <!-- Head -->
            <circle cx="12" cy="6" r="3" />
            <!-- Torso -->
            <line x1="12" y1="9" x2="12" y2="15" />
            <!-- Arms -->
            <line x1="8" y1="11" x2="16" y2="11" />
            <!-- Legs -->
            <line x1="12" y1="15" x2="9" y2="20" />
            <line x1="12" y1="15" x2="15" y2="20" />
          </svg>
          <span class="text-[10px] font-semibold tracking-wide text-zinc-400 dark:text-zinc-500 group-hover:text-zinc-700 dark:group-hover:text-zinc-300 transition-colors uppercase">Actor</span>
          <!-- Drag hint -->
          <div class="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
            <div class="grid grid-cols-2 gap-0.5">
              <span class="w-0.5 h-0.5 rounded-full bg-zinc-400 dark:bg-zinc-500" />
              <span class="w-0.5 h-0.5 rounded-full bg-zinc-400 dark:bg-zinc-500" />
              <span class="w-0.5 h-0.5 rounded-full bg-zinc-400 dark:bg-zinc-500" />
              <span class="w-0.5 h-0.5 rounded-full bg-zinc-400 dark:bg-zinc-500" />
              <span class="w-0.5 h-0.5 rounded-full bg-zinc-400 dark:bg-zinc-500" />
              <span class="w-0.5 h-0.5 rounded-full bg-zinc-400 dark:bg-zinc-500" />
            </div>
          </div>
        </div>

        <!-- Use Case -->
        <div
          draggable="true"
          @dragstart="handleDragStart($event, 'usecase')"
          class="group relative flex flex-col items-center justify-center gap-2 py-4 rounded-2xl cursor-grab active:cursor-grabbing active:scale-95 select-none transition-all duration-150
                 bg-white border border-zinc-200/70 hover:border-zinc-300 hover:shadow-md
                 dark:bg-zinc-900 dark:border-zinc-800 dark:hover:border-zinc-700 dark:hover:shadow-[0_4px_16px_rgba(0,0,0,0.4)]"
        >
          <!-- Ellipse shape preview -->
          <div class="w-10 h-6 rounded-full border-2 border-zinc-400 dark:border-zinc-500 group-hover:border-zinc-700 dark:group-hover:border-zinc-300 transition-colors pointer-events-none" />
          <span class="text-[10px] font-semibold tracking-wide text-zinc-400 dark:text-zinc-500 group-hover:text-zinc-700 dark:group-hover:text-zinc-300 transition-colors uppercase">Use Case</span>
          <div class="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
            <div class="grid grid-cols-2 gap-0.5">
              <span class="w-0.5 h-0.5 rounded-full bg-zinc-400 dark:bg-zinc-500" />
              <span class="w-0.5 h-0.5 rounded-full bg-zinc-400 dark:bg-zinc-500" />
              <span class="w-0.5 h-0.5 rounded-full bg-zinc-400 dark:bg-zinc-500" />
              <span class="w-0.5 h-0.5 rounded-full bg-zinc-400 dark:bg-zinc-500" />
              <span class="w-0.5 h-0.5 rounded-full bg-zinc-400 dark:bg-zinc-500" />
              <span class="w-0.5 h-0.5 rounded-full bg-zinc-400 dark:bg-zinc-500" />
            </div>
          </div>
        </div>
      </div>

      <!-- System Boundary — full width, distinct treatment -->
      <div
        draggable="true"
        @dragstart="handleDragStart($event, 'System')"
        class="group relative flex items-center gap-3 px-4 py-3 rounded-2xl cursor-grab active:cursor-grabbing active:scale-[0.98] select-none transition-all duration-150
               bg-white border border-zinc-200/70 hover:border-zinc-300 hover:shadow-md
               dark:bg-zinc-900 dark:border-zinc-800 dark:hover:border-zinc-700 dark:hover:shadow-[0_4px_16px_rgba(0,0,0,0.4)]"
      >
        <!-- Rect preview -->
        <div class="w-8 h-7 rounded border-2 border-dashed border-zinc-400 dark:border-zinc-500 group-hover:border-zinc-700 dark:group-hover:border-zinc-300 transition-colors pointer-events-none shrink-0" />
        <div class="flex flex-col">
          <span class="text-[11px] font-semibold text-zinc-650 dark:text-zinc-400 group-hover:text-zinc-900 dark:group-hover:text-zinc-100 transition-colors">System Boundary</span>
          <span class="text-[9px] text-zinc-400 dark:text-zinc-600 group-hover:text-zinc-500 dark:group-hover:text-zinc-500 transition-colors">Container for use cases</span>
        </div>
        <div class="ml-auto opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
          <div class="grid grid-cols-2 gap-0.5">
            <span class="w-0.5 h-0.5 rounded-full bg-zinc-400 dark:bg-zinc-500" />
            <span class="w-0.5 h-0.5 rounded-full bg-zinc-400 dark:bg-zinc-500" />
            <span class="w-0.5 h-0.5 rounded-full bg-zinc-400 dark:bg-zinc-500" />
            <span class="w-0.5 h-0.5 rounded-full bg-zinc-400 dark:bg-zinc-500" />
            <span class="w-0.5 h-0.5 rounded-full bg-zinc-400 dark:bg-zinc-500" />
            <span class="w-0.5 h-0.5 rounded-full bg-zinc-400 dark:bg-zinc-500" />
          </div>
        </div>
      </div>

      <!-- Package + Note row -->
      <div class="grid grid-cols-2 gap-2">
        <!-- Package -->
        <div
          draggable="true"
          @dragstart="handleDragStart($event, 'package')"
          class="group relative flex flex-col items-center justify-center gap-2 py-3.5 rounded-2xl cursor-grab active:cursor-grabbing active:scale-95 select-none transition-all duration-150
                 bg-white border border-zinc-200/70 hover:border-zinc-300 hover:shadow-md
                 dark:bg-zinc-900 dark:border-zinc-800 dark:hover:border-zinc-700 dark:hover:shadow-[0_4px_16px_rgba(0,0,0,0.4)]"
        >
          <!-- Package shape preview: tab + body -->
          <div class="flex flex-col items-start pointer-events-none">
            <div class="w-4 h-1.5 rounded-t border-t border-l border-r border-zinc-400 dark:border-zinc-500 group-hover:border-zinc-700 dark:group-hover:border-zinc-300 transition-colors" />
            <div class="w-8 h-5 rounded-sm rounded-tl-none border border-zinc-400 dark:border-zinc-500 group-hover:border-zinc-700 dark:group-hover:border-zinc-300 transition-colors" />
          </div>
          <span class="text-[10px] font-semibold tracking-wide text-zinc-400 dark:text-zinc-500 group-hover:text-zinc-700 dark:group-hover:text-zinc-300 transition-colors uppercase">Package</span>
        </div>

        <!-- Note -->
        <div
          draggable="true"
          @dragstart="handleDragStart($event, 'note')"
          class="group relative flex flex-col items-center justify-center gap-2 py-3.5 rounded-2xl cursor-grab active:cursor-grabbing active:scale-95 select-none transition-all duration-150
                 bg-white border border-zinc-200/70 hover:border-zinc-300 hover:shadow-md
                 dark:bg-zinc-900 dark:border-zinc-800 dark:hover:border-zinc-700 dark:hover:shadow-[0_4px_16px_rgba(0,0,0,0.4)]"
        >
          <!-- Dog-ear note preview -->
          <div class="relative pointer-events-none">
            <div class="w-8 h-6 bg-zinc-100 dark:bg-zinc-800 border border-zinc-400 dark:border-zinc-500 group-hover:border-zinc-600 dark:group-hover:border-zinc-400 transition-colors rounded-sm" />
            <div class="absolute top-0 right-0 w-2 h-2 bg-white dark:bg-zinc-900 border-b border-l border-zinc-400 dark:border-zinc-500 group-hover:border-zinc-600 dark:group-hover:border-zinc-400 transition-colors" 
                 style="clip-path: polygon(0 0, 100% 100%, 0 100%)" />
          </div>
          <span class="text-[10px] font-semibold tracking-wide text-zinc-400 dark:text-zinc-500 group-hover:text-zinc-700 dark:group-hover:text-zinc-300 transition-colors uppercase">Note</span>
        </div>
      </div>
    </div>

    <!-- ═══════════════════════════════════════════
         THIN RULE
    ════════════════════════════════════════════ -->
    <div class="border-t border-zinc-200/80 dark:border-zinc-800/80" />

    <!-- ═══════════════════════════════════════════
         SECTION B — CANVAS ACTIONS (icon row)
    ════════════════════════════════════════════ -->
    <div class="flex flex-col gap-2">
      <p class="text-[9px] font-bold uppercase tracking-widest text-zinc-500 dark:text-zinc-650 px-1 select-none">Actions</p>
      <div class="grid grid-cols-3 gap-1.5">

        <!-- Quick Link -->
        <button
          @click="handleLinkSpawnerClick"
          class="group flex flex-col items-center gap-1.5 py-3 rounded-xl cursor-pointer transition-all duration-150
                 bg-zinc-50 border border-zinc-200/60 hover:bg-white hover:border-zinc-300 hover:shadow-sm
                 dark:bg-zinc-900/60 dark:border-zinc-800/60 dark:hover:bg-zinc-800 dark:hover:border-zinc-700"
        >
          <ArrowUpRight class="w-4 h-4 text-zinc-400 dark:text-zinc-500 group-hover:text-zinc-800 dark:group-hover:text-zinc-200 transition-colors" />
          <span class="text-[9px] font-medium text-zinc-550 dark:text-zinc-400 group-hover:text-zinc-700 dark:group-hover:text-zinc-300 transition-colors">Link</span>
        </button>

        <!-- Add Text -->
        <button
          @click="handleTextAnnotationClick"
          class="group flex flex-col items-center gap-1.5 py-3 rounded-xl cursor-pointer transition-all duration-150
                 bg-zinc-50 border border-zinc-200/60 hover:bg-white hover:border-zinc-300 hover:shadow-sm
                 dark:bg-zinc-900/60 dark:border-zinc-800/60 dark:hover:bg-zinc-800 dark:hover:border-zinc-700"
        >
          <Type class="w-4 h-4 text-zinc-400 dark:text-zinc-500 group-hover:text-zinc-800 dark:group-hover:text-zinc-200 transition-colors" />
          <span class="text-[9px] font-medium text-zinc-550 dark:text-zinc-400 group-hover:text-zinc-700 dark:group-hover:text-zinc-300 transition-colors">Text</span>
        </button>

        <!-- Clear -->
        <button
          @click="handleClearCanvas"
          class="group flex flex-col items-center gap-1.5 py-3 rounded-xl cursor-pointer transition-all duration-150
                 bg-rose-50/40 border border-rose-100 hover:bg-rose-50 hover:border-rose-200
                 dark:bg-rose-950/10 dark:border-rose-900/20 dark:hover:bg-rose-950/20 dark:hover:border-rose-900/40"
        >
          <Trash2 class="w-4 h-4 text-rose-400 dark:text-rose-500 group-hover:text-rose-600 dark:group-hover:text-rose-400 transition-colors" />
          <span class="text-[9px] font-medium text-rose-500 dark:text-rose-455 group-hover:text-rose-600 dark:group-hover:text-rose-400 transition-colors">Clear</span>
        </button>
      </div>
    </div>

    <!-- ═══════════════════════════════════════════
         THIN RULE
    ════════════════════════════════════════════ -->
    <div class="border-t border-zinc-200/80 dark:border-zinc-800/80" />

    <!-- ═══════════════════════════════════════════
         SECTION C — SAVE (primary action zone)
    ════════════════════════════════════════════ -->
    <div class="flex flex-col gap-2">
      <!-- Title input — minimal, feels like a property inspector -->
      <div class="flex items-center gap-2 px-1">
        <span class="text-[9px] font-bold uppercase tracking-widest text-zinc-500 dark:text-zinc-650 shrink-0">Title</span>
        <input
          v-model="diagramStore.currentDiagramTitle"
          type="text"
          placeholder="Untitled Diagram"
          class="flex-1 bg-transparent text-[11px] font-medium text-zinc-800 dark:text-zinc-200 placeholder-zinc-350 dark:placeholder-zinc-700 focus:outline-none border-none min-w-0"
        />
      </div>

      <!-- Save button — the one bold element in the sidebar -->
      <button
        @click="handleCloudSave"
        class="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl font-semibold text-[11px] cursor-pointer transition-all duration-150 active:scale-[0.97]
               bg-zinc-900 hover:bg-zinc-800 text-white shadow-sm
               dark:bg-zinc-100 dark:hover:bg-white dark:text-zinc-900"
      >
        <Save class="w-3.5 h-3.5" />
        Save to Cloud
      </button>

      <!-- Save status -->
      <transition name="fade">
        <div
          v-if="diagramStore.globalSaveStatusMessage"
          class="flex items-center gap-1.5 px-2 py-1.5 rounded-lg text-[10px] font-medium"
          :class="diagramStore.globalSaveStatusMessage.includes('Successful')
            ? 'text-emerald-700 bg-emerald-50 border border-emerald-100 dark:text-emerald-400 dark:bg-emerald-950/20 dark:border-emerald-900/30'
            : 'text-amber-700 bg-amber-50 border border-amber-100 dark:text-amber-400 dark:bg-amber-950/20 dark:border-amber-900/30'"
        >
          <span>{{ diagramStore.globalSaveStatusMessage.includes('Successful') ? '✓' : '⚠' }}</span>
          {{ diagramStore.globalSaveStatusMessage }}
        </div>
      </transition>
    </div>

    <!-- ═══════════════════════════════════════════
         THIN RULE
    ════════════════════════════════════════════ -->
    <div class="border-t border-zinc-200/80 dark:border-zinc-800/80" />

    <!-- ═══════════════════════════════════════════
         SECTION D — LOCAL OPS (inline icon strip)
    ════════════════════════════════════════════ -->
    <div class="flex flex-col gap-2">
      <p class="text-[9px] font-bold uppercase tracking-widest text-zinc-500 dark:text-zinc-650 px-1 select-none">File</p>
      <div class="flex items-center gap-1">

        <!-- Export -->
        <button
          @click="emitLocalExport"
          title="Export JSON"
          class="group flex-1 flex flex-col items-center gap-1 py-2.5 rounded-xl cursor-pointer transition-all duration-150
                 bg-zinc-50 border border-zinc-200/60 hover:bg-white hover:border-zinc-300 hover:shadow-sm
                 dark:bg-zinc-900/60 dark:border-zinc-800/60 dark:hover:bg-zinc-800 dark:hover:border-zinc-700"
        >
          <Download class="w-3.5 h-3.5 text-zinc-400 dark:text-zinc-500 group-hover:text-zinc-700 dark:group-hover:text-zinc-300 transition-colors" />
          <span class="text-[8px] font-semibold text-zinc-550 dark:text-zinc-400 group-hover:text-zinc-700 dark:group-hover:text-zinc-300 transition-colors uppercase tracking-wide">Export</span>
        </button>

        <!-- Import -->
        <button
          @click="triggerFileInput"
          title="Import JSON"
          class="group flex-1 flex flex-col items-center gap-1 py-2.5 rounded-xl cursor-pointer transition-all duration-150
                 bg-zinc-50 border border-zinc-200/60 hover:bg-white hover:border-zinc-300 hover:shadow-sm
                 dark:bg-zinc-900/60 dark:border-zinc-800/60 dark:hover:bg-zinc-800 dark:hover:border-zinc-700"
        >
          <Upload class="w-3.5 h-3.5 text-zinc-400 dark:text-zinc-500 group-hover:text-zinc-700 dark:group-hover:text-zinc-300 transition-colors" />
          <span class="text-[8px] font-semibold text-zinc-550 dark:text-zinc-400 group-hover:text-zinc-700 dark:group-hover:text-zinc-300 transition-colors uppercase tracking-wide">Import</span>
        </button>

        <!-- Snapshot -->
        <button
          @click="emitLocalSnapshot"
          title="Save PNG"
          class="group flex-1 flex flex-col items-center gap-1 py-2.5 rounded-xl cursor-pointer transition-all duration-150
                 bg-zinc-50 border border-zinc-200/60 hover:bg-white hover:border-zinc-300 hover:shadow-sm
                 dark:bg-zinc-900/60 dark:border-zinc-800/60 dark:hover:bg-zinc-800 dark:hover:border-zinc-700"
        >
          <Camera class="w-3.5 h-3.5 text-zinc-400 dark:text-zinc-500 group-hover:text-zinc-700 dark:group-hover:text-zinc-300 transition-colors" />
          <span class="text-[8px] font-semibold text-zinc-550 dark:text-zinc-400 group-hover:text-zinc-700 dark:group-hover:text-zinc-300 transition-colors uppercase tracking-wide">Snapshot</span>
        </button>
      </div>
    </div>

    <!-- ═══════════════════════════════════════════
         SIGN OUT — pushed to bottom naturally
    ════════════════════════════════════════════ -->
    <div class="mt-auto pt-2">
      <button
        @click="handleLogOutFlow"
        class="w-full flex items-center justify-center gap-1.5 py-2 rounded-xl cursor-pointer transition-all duration-150 text-[10px] font-semibold
               text-zinc-400 dark:text-zinc-600 hover:text-rose-500 dark:hover:text-rose-400
               border border-transparent hover:border-rose-100 dark:hover:border-rose-900/30 hover:bg-rose-50/50 dark:hover:bg-rose-950/10"
      >
        <LogOut class="w-3.5 h-3.5" />
        Sign Out
      </button>
    </div>

    <!-- Hidden file input -->
    <input type="file" ref="fileLoader" @change="handleFileImport" class="hidden" accept=".json" />
  </div>
</template>

<script setup>
import { ref } from 'vue';
import html2canvas from 'html2canvas';
import { useDiagramStore } from '../stores/diagramStore';
import { useAuthStore } from '../stores/authStore';
import {
  ArrowUpRight, Type, Trash2,
  Download, Upload, Camera,
  LogOut, Save
} from 'lucide-vue-next';

const diagramStore = useDiagramStore();
const authStore    = useAuthStore();
const fileLoader   = ref(null);

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
      diagramStore.elements = data.elements.map(el => ({
        id:     el.id,
        type:   el.type,
        label:  el.label,
        x:      Number(el.x)      || 100,
        y:      Number(el.y)      || 100,
        width:  Number(el.width)  || (el.type === 'actor' ? 80 : el.type === 'System' ? 300 : 140),
        height: Number(el.height) || (el.type === 'actor' ? 120 : el.type === 'System' ? 400 : 80),
      }));
      diagramStore.connections = data.connections.map(c => {
        const from = diagramStore.elements.find(el => String(el.id) === String(c.from));
        const to   = diagramStore.elements.find(el => String(el.id) === String(c.to));
        return { id: c.id, from, to, fromSide: c.fromSide, toSide: c.toSide, type: c.type || 'association' };
      }).filter(c => c.from && c.to);
    } catch {
      alert('Invalid JSON file.');
    }
  };
  reader.readAsText(file);
};

const emitLocalExport = () => {
  const data = {
    elements:    diagramStore.elements.map(e => ({ id: e.id, type: e.type, label: e.label, x: e.x, y: e.y, width: e.width, height: e.height })),
    connections: diagramStore.connections.map(c => ({ id: c.id, from: c.from?.id, to: c.to?.id, fromSide: c.fromSide, toSide: c.toSide, type: c.type })),
  };
  const url  = URL.createObjectURL(new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' }));
  const link = Object.assign(document.createElement('a'), { href: url, download: 'uml-diagram.json' });
  link.click();
  URL.revokeObjectURL(url);
};

const emitLocalSnapshot = () => {
  const el = document.getElementById('uml-canvas');
  if (!el) return;
  html2canvas(el).then(canvas => {
    Object.assign(document.createElement('a'), { download: 'uml-diagram.png', href: canvas.toDataURL('image/png') }).click();
  });
};

const handleLogOutFlow = () => { diagramStore.resetDiagram(); authStore.logout(); };

const handleLinkSpawnerClick = () => {
  if (diagramStore.selectedElements.length >= 2) {
    diagramStore.connectElements(diagramStore.selectedElements[0], diagramStore.selectedElements[1], 'right', 'left', 'association');
  } else {
    alert('Select at least two elements on the canvas first.');
  }
};

const handleTextAnnotationClick = () => {
  diagramStore.saveToHistory();
  diagramStore.elements.push({ id: `note-${Date.now()}`, type: 'note', label: 'Note', x: 300, y: 200, width: 140, height: 80 });
};

const handleClearCanvas = () => { diagramStore.resetDiagram(); };
</script>

<style scoped>
.fade-enter-active, .fade-leave-active { transition: opacity 0.15s ease; }
.fade-enter-from,  .fade-leave-to      { opacity: 0; }
</style>
