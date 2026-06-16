<template>
  <svg class="connector">
    <path 
      :d="pathString" 
      fill="none" 
      class="stroke-[#18181b]" 
      stroke-width="2.5" 
      :stroke-dasharray="isDash ? '6,4' : 'none'"
    />
    
    <text
      :x="labelX"
      :y="labelY"
      font-size="11"
      font-weight="700"
      text-anchor="middle"
      class="connector-label fill-[#18181b] tracking-tight"
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
  return x2; // Mixed edge label near the vertical segment
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
  return y1 - 12; // Mixed edge label near the horizontal segment
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
