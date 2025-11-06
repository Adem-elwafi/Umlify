<template>
  <svg class="connector">
    <defs>
      <filter id="shadow">
        <feDropShadow dx="0" dy="2" stdDeviation="3" flood-color="#427A76" flood-opacity="0.3"/>
      </filter>
    </defs>
    <line
      :x1="from.x"
      :y1="from.y"
      :x2="to.x"
      :y2="to.y"
      stroke="#427A76"
      stroke-width="3"
      stroke-dasharray="5,5"
      filter="url(#shadow)"
    />
    <text
      :x="(from.x + to.x) / 2"
      :y="(from.y + to.y) / 2 - 12"
      font-size="13"
      font-weight="700"
      fill="#174143"
      text-anchor="middle"
      class="connector-label"
    >
      {{ type }}
    </text>
  </svg>
</template>

<script setup>
const props = defineProps({
  from: Object,
  to: Object,
  type: String
})
</script>

<style scoped>
.connector {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none; /* let mouse events through to elements */
}

.connector-label {
  paint-order: stroke;
  stroke: rgba(245, 229, 225, 0.9);
  stroke-width: 4px;
  stroke-linejoin: round;
}
</style>