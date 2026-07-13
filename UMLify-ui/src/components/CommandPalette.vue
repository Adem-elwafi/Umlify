<template>
  <Teleport to="body">
    <Transition name="command-fade">
      <div
        v-if="open"
        class="fixed inset-0 z-[200] flex items-start justify-center pt-[15vh] bg-zinc-950/50 backdrop-blur-sm"
        @click.self="close"
      >
        <div class="w-[clamp(320px,90vw,560px)] bg-bg-surface border border-border-default rounded-panel shadow-2xl overflow-hidden">
          <div class="p-3 border-b border-border-default">
            <input
              ref="searchInput"
              v-model="query"
              type="text"
              placeholder="Type a command…"
              class="w-full h-10 px-3 py-2 text-sm bg-bg-base border border-border-default rounded-interactive text-text-primary placeholder:text-text-muted outline-none focus-visible:ring-2 focus-visible:ring-interactive-accent"
              @keydown="onKeydown"
              @input="activeIndex = 0"
            />
          </div>
          <ul class="max-h-[50vh] overflow-y-auto py-2">
            <li
              v-for="(cmd, i) in filtered"
              :key="cmd.id"
              @mouseenter="activeIndex = i"
              @click="run(cmd)"
              :class="[
                'px-4 py-2 text-sm cursor-pointer flex items-center gap-2',
                i === activeIndex ? 'bg-bg-elevated text-text-primary' : 'text-text-secondary'
              ]"
            >
              <span class="font-medium">{{ cmd.label }}</span>
            </li>
            <li v-if="filtered.length === 0" class="px-4 py-2 text-sm text-text-muted">No matching commands</li>
          </ul>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup>
import { ref, computed, watch, nextTick } from 'vue';
import { useDiagramStore } from '../stores/diagramStore';
import { useInteractionEngine, InteractionState } from '../engines/interaction';

const emit = defineEmits(['toggle-theme']);

const diagramStore = useDiagramStore();
const interaction = useInteractionEngine();

const open = computed(() => interaction.is(InteractionState.COMMAND_PALETTE_OPEN));
const query = ref('');
const activeIndex = ref(0);
const searchInput = ref(null);

const commands = computed(() => [
  { id: 'add-actor', label: 'Add Actor', run: () => diagramStore.addActor() },
  { id: 'add-usecase', label: 'Add Use Case', run: () => diagramStore.addUseCase() },
  { id: 'add-system', label: 'Add System Boundary', run: () => diagramStore.addSystem() },
  { id: 'add-package', label: 'Add Package', run: () => diagramStore.addPackage() },
  { id: 'add-note', label: 'Add Note', run: () => diagramStore.addNote() },
  { id: 'dup', label: 'Duplicate Selection', run: duplicateSelection },
  { id: 'del', label: 'Delete Selection', run: deleteSelection },
  { id: 'save', label: 'Save to Cloud', run: () => diagramStore.saveCurrentDiagram(diagramStore.currentDiagramTitle) },
  { id: 'zoom-in', label: 'Zoom In', run: () => diagramStore.setZoomLevel(Math.min(2, diagramStore.zoomLevel + 0.1)) },
  { id: 'zoom-out', label: 'Zoom Out', run: () => diagramStore.setZoomLevel(Math.max(0.5, diagramStore.zoomLevel - 0.1)) },
  { id: 'zoom-reset', label: 'Reset Zoom', run: () => diagramStore.setZoomLevel(1) },
  { id: 'theme', label: 'Toggle Theme', run: () => emit('toggle-theme') }
]);

const filtered = computed(() => {
  const q = query.value.trim().toLowerCase();
  if (!q) return commands.value;
  return commands.value.filter(c => c.label.toLowerCase().includes(q));
});

function duplicateSelection() {
  const ids = diagramStore.selectedElements;
  if (!ids.length) return;
  if (typeof diagramStore.saveToHistory === 'function') diagramStore.saveToHistory();
  const now = Date.now();
  const newIds = [];
  ids.forEach((idStr, i) => {
    const src = diagramStore.elements.find(e => String(e.id) === String(idStr));
    if (src) {
      const d = JSON.parse(JSON.stringify(src));
      d.id = `${src.id.split('_')[0] || 'el'}_${now}_${i}`;
      d.x = (src.x || 0) + 20;
      d.y = (src.y || 0) + 20;
      diagramStore.addElement(d);
      newIds.push(String(d.id));
    }
  });
  if (newIds.length) diagramStore.setSelectedElements(newIds);
}

function deleteSelection() {
  diagramStore.selectedElements.forEach(id => diagramStore.deleteElement(id));
  diagramStore.setSelectedElements([]);
}

function run(cmd) {
  cmd.run();
  close();
}

function close() {
  if (interaction.is(InteractionState.COMMAND_PALETTE_OPEN)) interaction.reset();
}

function onKeydown(e) {
  if (e.key === 'Escape') {
    e.preventDefault();
    close();
  } else if (e.key === 'ArrowDown') {
    e.preventDefault();
    activeIndex.value = Math.min(activeIndex.value + 1, filtered.value.length - 1);
  } else if (e.key === 'ArrowUp') {
    e.preventDefault();
    activeIndex.value = Math.max(activeIndex.value - 1, 0);
  } else if (e.key === 'Enter') {
    e.preventDefault();
    const cmd = filtered.value[activeIndex.value];
    if (cmd) run(cmd);
  }
}

watch(open, (isOpen) => {
  if (isOpen) {
    query.value = '';
    activeIndex.value = 0;
    nextTick(() => searchInput.value?.focus());
  }
});
</script>

<style scoped>
.command-fade-enter-active,
.command-fade-leave-active {
  transition: opacity 0.15s ease;
}
.command-fade-enter-from,
.command-fade-leave-to {
  opacity: 0;
}
</style>
