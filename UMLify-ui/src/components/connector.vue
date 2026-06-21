<template>
  <svg class="connector">
    <defs>
      <!-- Sharp solid triangle for associations -->
      <marker 
        id="marker-association" 
        viewBox="0 0 10 10" 
        refX="7" 
        refY="5" 
        markerWidth="6" 
        markerHeight="6" 
        orient="auto-start-reverse" 
        markerUnits="strokeWidth"
      >
        <path d="M 0 2 L 8 5 L 0 8 z" fill="var(--color-primary-slate)" />
      </marker>
      
      <!-- Open chevron for dependencies, includes, and extends -->
      <marker 
        id="marker-dependency" 
        viewBox="0 0 10 10" 
        refX="7" 
        refY="5" 
        markerWidth="6" 
        markerHeight="6" 
        orient="auto-start-reverse" 
        markerUnits="strokeWidth"
      >
        <path d="M 1 2 L 7 5 L 1 8" fill="none" stroke="var(--color-primary-slate)" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
      </marker>
      
      <!-- Hollow triangle for generalizations -->
      <marker 
        id="marker-generalisation" 
        viewBox="0 0 10 10" 
        refX="7" 
        refY="5" 
        markerWidth="6" 
        markerHeight="6" 
        orient="auto-start-reverse" 
        markerUnits="strokeWidth"
      >
        <path d="M 1 2 L 7 5 L 1 8 z" fill="white" stroke="var(--color-primary-slate)" stroke-width="1.5" stroke-linejoin="round" />
      </marker>
    </defs>
    
    <path 
      :d="pathString" 
      fill="none" 
      stroke="var(--color-primary-slate)" 
      stroke-width="2.5" 
      :stroke-dasharray="isDash ? '6,4' : 'none'"
      :marker-end="computedMarker"
    />
    
    <text
      v-if="type !== 'association' && type !== ''"
      :x="labelX"
      :y="labelY"
      font-size="11"
      font-weight="700"
      text-anchor="middle"
      fill="var(--color-primary-slate)"
      class="connector-label tracking-tight"
    >
      {{ type }}
    </text>
  </svg>
</template>

<script setup>
import { computed } from 'vue';

const props = defineProps({
  from: Object,
  to: Object,
  type: String
})

const isDash = computed(() => ['include', 'extend', 'dependency'].includes(props.type));

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

const pathString = computed(() => {
  const x1 = props.from?.x || 0;
  const y1 = props.from?.y || 0;
  const x2 = props.to?.x || 0;
  const y2 = props.to?.y || 0;
  const fromSide = props.from?.side || 'right';
  const toSide = props.to?.side || 'left';

  const isFromHorizontal = ['left', 'right'].includes(fromSide);
  const isToHorizontal = ['left', 'right'].includes(toSide);

  // 1. Horizontal Exit/Entry Configuration (Left/Right to Left/Right)
  if (isFromHorizontal && isToHorizontal) {
    const midX = x1 + (x2 - x1) / 2;
    return `M ${x1} ${y1} L ${midX} ${y1} L ${midX} ${y2} L ${x2} ${y2}`;
  }

  // 2. Vertical Exit/Entry Configuration (Top/Bottom to Top/Bottom)
  if (!isFromHorizontal && !isToHorizontal) {
    const midY = y1 + (y2 - y1) / 2;
    return `M ${x1} ${y1} L ${x1} ${midY} L ${x2} ${midY} L ${x2} ${y2}`;
  }

  // 3. Mixed Edge Config (Horizontal to Vertical)
  // Logic: M x1 y1 L x2 y1 L x2 y2
  return `M ${x1} ${y1} L ${x2} ${y1} L ${x2} ${y2}`;
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
}

.connector-label {
  paint-order: stroke;
  stroke: #fafafa;
  stroke-width: 4px;
  stroke-linejoin: round;
}
</style>
