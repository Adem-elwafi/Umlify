<template>
  <div class="home">
    <Toolbar class="toolbar" />
    <Canvas class="canvas" />
    <ExportPanel v-if="showExport" class="export-panel" />
  </div>
</template>

<script setup>
import { ref } from 'vue'
import Toolbar from '../components/Toolbar.vue'
import Canvas from '../components/Canvas.vue'
import ExportPanel from '../components/ExportPanel.vue'

const showExport = ref(false)
</script>

<style scoped>
.home {
  display: grid;
  grid-template-columns: auto 1fr;
  grid-template-rows: 1fr;
  height: 100vh;
  width: 100vw;
}

.toolbar {
  grid-column: 1;
  border-right: 1px solid #e0e0e0;
}

.canvas {
  grid-column: 2;
  overflow: auto;
}

.export-panel {
  position: fixed;
  right: 1rem;
  top: 1rem;
  z-index: 100;
}
</style>
