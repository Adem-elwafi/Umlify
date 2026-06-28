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
          :class="isSelected ? 'fill-[var(--accent-violet)]' : 'fill-zinc-400 dark:fill-zinc-500'" 
          class="transition-colors duration-200"
        />
        <path 
          v-else-if="['include', 'extend', 'dependency'].includes(type)" 
          d="M 1 2 L 7 5 L 1 8" 
          fill="none" 
          :class="isSelected ? 'stroke-[var(--accent-violet)]' : 'stroke-zinc-400 dark:stroke-zinc-500'" 
          class="transition-colors duration-200"
          stroke-width="1.5" 
          stroke-linecap="round" 
          stroke-linejoin="round" 
        />
        <path 
          v-else-if="type === 'generalization'" 
          d="M 1 2 L 7 5 L 1 8 z" 
          fill="white" 
          :class="isSelected ? 'stroke-[var(--accent-violet)]' : 'stroke-zinc-400 dark:stroke-zinc-500'" 
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
      @click.stop="diagramStore.selectedConnectionId = props.id"
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
        isSelected ? 'stroke-[var(--accent-violet)] selected-glow' : 'stroke-zinc-400 dark:stroke-zinc-500'
      ]"
    />
    
    <text
      v-if="type !== 'association' && type !== ''"
      :x="labelX"
      :y="labelY"
      font-size="11"
      font-weight="700"
      text-anchor="middle"
      :class="isSelected ? 'fill-[var(--accent-violet)]' : 'fill-zinc-450 dark:fill-zinc-400'"
      class="connector-label tracking-tight transition-colors duration-200"
    >
      {{ type }}
    </text>
  </svg>
</template>

<script setup>
import { computed } from 'vue';
import { useDiagramStore } from '../stores/diagramStore';

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

function getElementDimensions(el) {
  if (!el) return { width: 0, height: 0 };
  let defaultW = 140;
  let defaultH = 80;
  if (el.type === 'actor') { defaultW = 80; defaultH = 120; }
  else if (el.type === 'System') { defaultW = 300; defaultH = 400; }
  else if (el.type === 'package') { defaultW = 200; defaultH = 150; }
  else if (el.type === 'note') { defaultW = 120; defaultH = 120; }
  return {
    width: el.width || defaultW,
    height: el.height || defaultH
  };
}

const fromBounds = computed(() => {
  if (!props.fromElement) return null;
  const { width, height } = getElementDimensions(props.fromElement);
  return {
    left: props.fromElement.x,
    right: props.fromElement.x + width,
    top: props.fromElement.y,
    bottom: props.fromElement.y + height
  };
});

const toBounds = computed(() => {
  if (!props.toElement) return null;
  const { width, height } = getElementDimensions(props.toElement);
  return {
    left: props.toElement.x,
    right: props.toElement.x + width,
    top: props.toElement.y,
    bottom: props.toElement.y + height
  };
});

const pathString = computed(() => {
  const x1 = props.from?.x || 0;
  const y1 = props.from?.y || 0;
  const x2 = props.to?.x || 0;
  const y2 = props.to?.y || 0;
  const fromSide = props.from?.side || 'right';
  const toSide = props.to?.side || 'left';
  const fromB = fromBounds.value;
  const toB = toBounds.value;

  // 1. Calculate clearance projection points using boundary edges
  let px1 = x1;
  let py1 = y1;
  if (props.fromElement && fromBounds.value) {
    const bounds = fromBounds.value;
    if (fromSide === 'right') px1 = bounds.right + 24;
    else if (fromSide === 'left') px1 = bounds.left - 24;
    else if (fromSide === 'top') py1 = bounds.top - 24;
    else if (fromSide === 'bottom') py1 = bounds.bottom + 24;
  } else {
    if (fromSide === 'right') px1 = x1 + 24;
    else if (fromSide === 'left') px1 = x1 - 24;
    else if (fromSide === 'top') py1 = y1 - 24;
    else if (fromSide === 'bottom') py1 = y1 + 24;
  }

  let px2 = x2;
  let py2 = y2;
  if (props.toElement && toBounds.value) {
    const bounds = toBounds.value;
    if (toSide === 'right') px2 = bounds.right + 24;
    else if (toSide === 'left') px2 = bounds.left - 24;
    else if (toSide === 'top') py2 = bounds.top - 24;
    else if (toSide === 'bottom') py2 = bounds.bottom + 24;
  } else {
    if (toSide === 'right') px2 = x2 + 24;
    else if (toSide === 'left') px2 = x2 - 24;
    else if (toSide === 'top') py2 = y2 - 24;
    else if (toSide === 'bottom') py2 = y2 + 24;
  }

  const isFromHorizontal = ['left', 'right'].includes(fromSide);
  const isToHorizontal = ['left', 'right'].includes(toSide);

  // Case A: Horizontal Exit -> Horizontal Entry
  if (isFromHorizontal && isToHorizontal) {
    // A1: Right to Left
    if (fromSide === 'right' && toSide === 'left') {
      if (x2 >= x1) {
        const midX = px1 + (px2 - px1) / 2;
        return `M ${x1} ${y1} L ${px1} ${py1} L ${midX} ${py1} L ${midX} ${py2} L ${px2} ${py2} L ${x2} ${y2}`;
      } else {
        const midY = py1 + (y2 - y1) / 2;
        return `M ${x1} ${y1} L ${px1} ${py1} L ${px1} ${midY} L ${px2} ${midY} L ${px2} ${py2} L ${x2} ${y2}`;
      }
    }
    // A2: Left to Right
    if (fromSide === 'left' && toSide === 'right') {
      if (x2 <= x1) {
        const midX = px1 + (px2 - px1) / 2;
        return `M ${x1} ${y1} L ${px1} ${py1} L ${midX} ${py1} L ${midX} ${py2} L ${px2} ${py2} L ${x2} ${y2}`;
      } else {
        const midY = py1 + (y2 - y1) / 2;
        return `M ${x1} ${y1} L ${px1} ${py1} L ${px1} ${midY} L ${px2} ${midY} L ${px2} ${py2} L ${x2} ${y2}`;
      }
    }
    // A3: Same-Side (Right-to-Right or Left-to-Left)
    let escapeY;
    if (y2 >= y1) {
      const maxY = Math.max(fromB ? fromB.bottom : y1, toB ? toB.bottom : y2);
      escapeY = maxY + 24;
    } else {
      const minY = Math.min(fromB ? fromB.top : y1, toB ? toB.top : y2);
      escapeY = minY - 24;
    }
    return `M ${x1} ${y1} L ${px1} ${py1} L ${px1} ${escapeY} L ${px2} ${escapeY} L ${px2} ${py2} L ${x2} ${y2}`;
  }

  // Case B: Vertical Exit -> Vertical Entry
  if (!isFromHorizontal && !isToHorizontal) {
    // B1: Bottom to Top
    if (fromSide === 'bottom' && toSide === 'top') {
      if (y2 >= y1) {
        const midY = py1 + (py2 - py1) / 2;
        return `M ${x1} ${y1} L ${px1} ${py1} L ${px1} ${midY} L ${px2} ${midY} L ${px2} ${py2} L ${x2} ${y2}`;
      } else {
        const midX = px1 + (x2 - x1) / 2;
        return `M ${x1} ${y1} L ${px1} ${py1} L ${midX} ${py1} L ${midX} ${py2} L ${px2} ${py2} L ${x2} ${y2}`;
      }
    }
    // B2: Top to Bottom
    if (fromSide === 'top' && toSide === 'bottom') {
      if (y2 <= y1) {
        const midY = py1 + (py2 - py1) / 2;
        return `M ${x1} ${y1} L ${px1} ${py1} L ${px1} ${midY} L ${px2} ${midY} L ${px2} ${py2} L ${x2} ${y2}`;
      } else {
        const midX = px1 + (x2 - x1) / 2;
        return `M ${x1} ${y1} L ${px1} ${py1} L ${midX} ${py1} L ${midX} ${py2} L ${px2} ${py2} L ${x2} ${y2}`;
      }
    }
    // B3: Same-Side (Top-to-Top or Bottom-to-Bottom)
    const escapeX = x2 >= x1 
      ? Math.max(fromB ? fromB.right : x1, toB ? toB.right : x2) + 24 
      : Math.min(fromB ? fromB.left : x1, toB ? toB.left : x2) - 24;
    return `M ${x1} ${y1} L ${px1} ${py1} L ${escapeX} ${py1} L ${escapeX} ${py2} L ${px2} ${py2} L ${x2} ${y2}`;
  }

  // Case C: Horizontal Exit -> Vertical Entry
  if (isFromHorizontal && !isToHorizontal) {
    if ((fromSide === 'right' && px2 < px1) || 
        (fromSide === 'left' && px2 > px1) ||
        (toSide === 'bottom' && py1 < py2) ||
        (toSide === 'top' && py1 > py2)) {
      return `M ${x1} ${y1} L ${px1} ${py1} L ${px1} ${py2} L ${px2} ${py2} L ${x2} ${y2}`;
    }
    return `M ${x1} ${y1} L ${px1} ${py1} L ${px2} ${py1} L ${px2} ${py2} L ${x2} ${y2}`;
  }

  // Case D: Vertical Exit -> Horizontal Entry
  if (!isFromHorizontal && isToHorizontal) {
    if ((fromSide === 'bottom' && py2 < py1) || 
        (fromSide === 'top' && py2 > py1) ||
        (toSide === 'left' && px1 > px2) ||
        (toSide === 'right' && px1 < px2)) {
      return `M ${x1} ${y1} L ${px1} ${py1} L ${px2} ${py1} L ${px2} ${py2} L ${x2} ${y2}`;
    }
    return `M ${x1} ${y1} L ${px1} ${py1} L ${px1} ${py2} L ${px2} ${py2} L ${x2} ${y2}`;
  }

  return `M ${x1} ${y1} L ${x2} ${y2}`;
});

const labelX = computed(() => {
  const x1 = props.from?.x || 0;
  const x2 = props.to?.x || 0;
  const fromSide = props.from?.side || 'right';
  const toSide = props.to?.side || 'left';

  const isFromHorizontal = ['left', 'right'].includes(fromSide);
  const isToHorizontal = ['left', 'right'].includes(toSide);

  if (isFromHorizontal && isToHorizontal) return x1 + (x2 - x1) / 2;
  if (!isFromHorizontal && !isToHorizontal) return (x1 + x2) / 2;
  
  // Mixed Edges
  if (isFromHorizontal) { // H -> V
    return x2;
  } else { // V -> H
    return x1 + (x2 - x1) / 2;
  }
});

const labelY = computed(() => {
  const y1 = props.from?.y || 0;
  const y2 = props.to?.y || 0;
  const fromSide = props.from?.side || 'right';
  const toSide = props.to?.side || 'left';

  const isFromHorizontal = ['left', 'right'].includes(fromSide);
  const isToHorizontal = ['left', 'right'].includes(toSide);

  if (isFromHorizontal && isToHorizontal) return (y1 + y2) / 2 - 12;
  if (!isFromHorizontal && !isToHorizontal) return y1 + (y2 - y1) / 2 - 12;

  // Mixed Edges
  if (isFromHorizontal) { // H -> V
    return y1 + (y2 - y1) / 2;
  } else { // V -> H
    return y2 - 12;
  }
});
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
  filter: drop-shadow(0 0 3px rgba(221, 174, 211, 0.6));
}

.connector-label {
  paint-order: stroke;
  stroke: #fafafa;
  stroke-width: 4px;
  stroke-linejoin: round;
}
</style>
