<template>
  <Surface
    :border="false"
    depth="1"
    customClass="h-7 w-full flex items-center justify-between px-md font-mono text-[10px] text-zinc-400 bg-statusbar-bg border-t border-bar-border shrink-0 select-none"
  >
    <!-- Left Section: Compile Status & Message -->
    <div class="flex items-center gap-2">
      <slot name="left">
        <span class="text-[11px]" :class="statusColorClass">●</span>
        <span class="truncate max-w-[500px]" :title="displayMessage">{{ displayMessage }}</span>
      </slot>
    </div>

    <!-- Right Section: Metrics & Telemetry -->
    <div class="flex items-center gap-4">
      <slot name="right">
        <div class="flex items-center gap-2 text-zinc-400">
          <span>{{ diagramStore.elements.length }} Elem</span>
          <span class="opacity-50">/</span>
          <span>{{ diagramStore.connections.length }} Conn</span>
        </div>
        <span class="w-px h-3 bg-zinc-700"></span>
        <span>Zoom: {{ Math.round(diagramStore.zoomLevel * 100) }}%</span>
        <span class="w-px h-3 bg-zinc-700"></span>
        <span>X: {{ diagramStore.cursorCoords.x }} Y: {{ diagramStore.cursorCoords.y }}</span>
      </slot>
    </div>
  </Surface>
</template>

<script setup>
import { computed } from 'vue';
import { useDiagramStore } from '../../../stores/diagramStore';
import Surface from './Surface.vue';

const diagramStore = useDiagramStore();

const displayMessage = computed(() => {
  if (diagramStore.globalSaveStatusMessage) {
    return diagramStore.globalSaveStatusMessage;
  }
  if (diagramStore.networkErrorMessage) {
    return `Network Error: ${diagramStore.networkErrorMessage}`;
  }
  return diagramStore.compilerMessage || 'Ready for telemetry transmission...';
});

const statusColorClass = computed(() => {
  if (diagramStore.globalSaveStatusMessage) {
    if (diagramStore.globalSaveStatusMessage.toLowerCase().includes('success')) {
      return 'text-success';
    }
    return 'text-warning animate-pulse';
  }
  if (diagramStore.networkErrorMessage) {
    return 'text-error';
  }
  switch (diagramStore.compilerStatus) {
    case 'compiling':
      return 'text-warning animate-pulse';
    case 'success':
      return 'text-success';
    case 'error':
      return 'text-error';
    case 'warning':
      return 'text-warning';
    default:
      return 'text-text-muted';
  }
});
</script>
