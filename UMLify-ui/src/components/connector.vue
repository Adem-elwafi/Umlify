<template>
  <svg class="connector">
    <defs>
      <!-- Dynamic Marker containing responsive elements based on type -->
      <marker 
        :id="`arrow-${props.id}`" 
        viewBox="0 0 10 10" 
        refX="7" 
        refY="5" 
        markerWidth="6" 
        markerHeight="6" 
        orient="auto-start-reverse" 
        markerUnits="strokeWidth"
      >
        <path 
          v-if="type === 'association' || type === ''" 
          d="M 0 2 L 8 5 L 0 8 z" 
          :class="isSelected ? 'fill-[var(--color-interactive-accent)]' : 'fill-zinc-400 dark:fill-zinc-500'" 
          class="transition-colors duration-200"
        />
        <path 
          v-else-if="['include', 'extend', 'dependency'].includes(type)" 
          d="M 1 2 L 7 5 L 1 8" 
          fill="none" 
          :class="isSelected ? 'stroke-[var(--color-interactive-accent)]' : 'stroke-zinc-400 dark:fill-none dark:stroke-zinc-500'" 
          class="transition-colors duration-200"
          stroke-width="1.5" 
          stroke-linecap="round" 
          stroke-linejoin="round" 
        />
        <path 
          v-else-if="type === 'generalization'" 
          d="M 1 2 L 7 5 L 1 8 z" 
          fill="white" 
          :class="isSelected ? 'stroke-[var(--color-interactive-accent)]' : 'stroke-zinc-400 dark:stroke-zinc-500'" 
          class="transition-colors duration-200"
          stroke-width="1.5" 
          stroke-linejoin="round" 
        />
      </marker>
    </defs>
    
    <!-- Path A: Interaction Target hitbox overlay -->
    <path 
      :d="pathString" 
      fill="none" 
      stroke="transparent" 
      stroke-width="12" 
      class="interaction-target cursor-pointer"
      @click.stop="diagramStore.setSelectedConnection(props.id)"
    />
    
    <!-- Path B: Visual relationship line vector -->
    <path 
      :d="pathString" 
      fill="none" 
      stroke-width="2" 
      :stroke-dasharray="isDash ? '6,4' : 'none'"
      :marker-end="`url(#arrow-${props.id})`"
      class="pointer-events-none transition-colors duration-200"
      :class="[
        isSelected ? 'stroke-[var(--color-interactive-accent)] selected-glow' : 'stroke-zinc-400 dark:stroke-zinc-500'
      ]"
    />
    
    <rect
      v-if="type !== 'association' && type !== ''"
      :x="labelX - labelBgWidth / 2"
      :y="labelY - 9"
      :width="labelBgWidth"
      height="18"
      fill="var(--color-bg-canvas)"
      rx="3"
    />

    <text
      v-if="type !== 'association' && type !== ''"
      :x="labelX"
      :y="labelY"
      font-size="11"
      font-weight="700"
      text-anchor="middle"
      :class="isSelected ? 'fill-[var(--color-interactive-accent)]' : 'fill-zinc-450 dark:fill-zinc-400'"
      class="connector-label tracking-tight transition-colors duration-200"
    >
      {{ type }}
    </text>
  </svg>
</template>

<script setup>
import { computed } from 'vue';
import { useDiagramStore } from '../stores/diagramStore';
import { 
  getOrthogonalPathPoints, 
  getOrthogonalPathMidpoint, 
  getPathStringFromPoints 
} from '../utils/connectorRouting';

const props = defineProps({
  id: String,
  from: Object,
  to: Object,
  fromElement: Object,
  toElement: Object,
  type: String
});

const diagramStore = useDiagramStore();

const isDash = computed(() => ['include', 'extend', 'dependency'].includes(props.type));

const isSelected = computed(() => String(diagramStore.selectedConnectionId) === String(props.id));

const computedMarker = computed(() => {
  if (props.type === 'association') {
    return 'url(#marker-association)';
  }
  if (['include', 'extend', 'dependency'].includes(props.type)) {
    return 'url(#marker-dependency)';
  }
  if (props.type === 'generalization') {
    return 'url(#marker-generalisation)';
  }
  return null;
});

const pathPoints = computed(() => {
  return getOrthogonalPathPoints(props.from, props.fromElement, props.to, props.toElement);
});

const pathString = computed(() => getPathStringFromPoints(pathPoints.value));

const midPt = computed(() => getOrthogonalPathMidpoint(pathPoints.value));

const labelOffset = computed(() => {
  const pts = pathPoints.value
  if (!pts || pts.length < 2) return { x: 0, y: 0 }
  const dx = pts[pts.length - 1].x - pts[0].x
  const dy = pts[pts.length - 1].y - pts[0].y
  if (Math.abs(dx) >= Math.abs(dy)) {
    return { x: 0, y: dy >= 0 ? 8 : -8 }
  }
  return { x: dx >= 0 ? 8 : -8, y: 0 }
});

const labelBgWidth = computed(() => {
  const len = (props.type || '').length
  return Math.max(44, len * 7 + 12)
});

const labelX = computed(() => midPt.value.x + labelOffset.value.x)
const labelY = computed(() => midPt.value.y + labelOffset.value.y)
</script>

<style scoped>
.connector {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: 15;
}

.connector .interaction-target {
  pointer-events: stroke;
}

.selected-glow {
  filter: drop-shadow(0 0 3px rgba(59, 130, 246, 0.4));
}

.connector-label {
  paint-order: stroke;
  stroke: var(--color-bg-canvas);
  stroke-width: 4px;
  stroke-linejoin: round;
}
</style>
