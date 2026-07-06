<template>
  <Surface
    depth="1"
    radius="md"
    :border="true"
    custom-class="absolute bottom-md right-md z-dropdown w-44 aspect-[3/2] bg-bg-surface/70 backdrop-blur-md border-border-default pointer-events-none select-none overflow-hidden"
  >
    <div class="w-full h-full p-2.5 relative flex flex-col justify-between">
      <!-- MiniMap Title Header -->
      <div class="text-[9px] font-bold uppercase tracking-wider text-text-muted select-none flex items-center justify-between shrink-0 mb-1.5">
        <span>Minimap</span>
        <span class="text-[8px] font-mono opacity-60">{{ elements.length }} nodes</span>
      </div>
      
      <!-- SVG Minimap Canvas -->
      <div class="flex-1 w-full relative min-h-0">
        <svg
          class="w-full h-full overflow-visible"
          :viewBox="viewBox"
          preserveAspectRatio="xMidYMid meet"
        >
          <g v-for="el in elements" :key="el.id">
            <!-- System boundary representation -->
            <rect
              v-if="el.type === 'System'"
              :x="el.x"
              :y="el.y"
              :width="el.width || 300"
              :height="el.height || 400"
              rx="4"
              class="fill-transparent stroke-text-secondary"
              stroke-width="2.5"
              stroke-dasharray="4,4"
            />
            
            <!-- Actor representation (Circle) -->
            <circle
              v-else-if="el.type === 'actor'"
              :cx="el.x + (el.width || 80) / 2"
              :cy="el.y + (el.height || 120) / 2"
              :r="Math.min(el.width || 80, el.height || 120) / 2.5"
              :class="[
                'transition-all duration-200',
                selectedElements.includes(String(el.id))
                  ? 'fill-[var(--color-interactive-accent)]/30 stroke-[var(--color-interactive-accent)] stroke-[2px]'
                  : 'fill-text-secondary/15 stroke-text-secondary/60'
              ]"
              stroke-width="1.5"
            />
            
            <!-- UseCase representation (Ellipse) -->
            <ellipse
              v-else-if="el.type === 'usecase'"
              :cx="el.x + (el.width || 140) / 2"
              :cy="el.y + (el.height || 80) / 2"
              :rx="(el.width || 140) / 2"
              :ry="(el.height || 80) / 2"
              :class="[
                'transition-all duration-200',
                selectedElements.includes(String(el.id))
                  ? 'fill-[var(--color-interactive-accent)]/30 stroke-[var(--color-interactive-accent)] stroke-[2px]'
                  : 'fill-text-secondary/15 stroke-text-secondary/60'
              ]"
              stroke-width="1.5"
            />
            
            <!-- Package, Note, or other standard nodes (Rectangles) -->
            <rect
              v-else
              :x="el.x"
              :y="el.y"
              :width="el.width || (el.type === 'package' ? 200 : 120)"
              :height="el.height || (el.type === 'package' ? 150 : 120)"
              :rx="el.type === 'package' ? 6 : 2"
              :class="[
                'transition-all duration-200',
                selectedElements.includes(String(el.id))
                  ? 'fill-[var(--color-interactive-accent)]/30 stroke-[var(--color-interactive-accent)] stroke-[2px]'
                  : 'fill-text-secondary/15 stroke-text-secondary/60'
              ]"
              stroke-width="1.5"
            />
          </g>
        </svg>
      </div>
    </div>
  </Surface>
</template>

<script setup>
import { computed } from 'vue';
import { storeToRefs } from 'pinia';
import { useDiagramStore } from '../stores/diagramStore';
import Surface from './ui/layout/Surface.vue';

const diagramStore = useDiagramStore();
const { elements, selectedElements } = storeToRefs(diagramStore);

// Computed viewBox to frame all coordinates inside a neat bounding box
const viewBox = computed(() => {
  if (!elements.value || elements.value.length === 0) {
    return '0 0 2000 1333'; // Default fallback area (3:2 aspect ratio)
  }

  let minX = Infinity;
  let minY = Infinity;
  let maxX = -Infinity;
  let maxY = -Infinity;

  elements.value.forEach(el => {
    let w = 140;
    let h = 80;
    if (el.type === 'actor') { w = 80; h = 120; }
    else if (el.type === 'System') { w = 300; h = 400; }
    else if (el.type === 'package') { w = 200; h = 150; }
    else if (el.type === 'note') { w = 120; h = 120; }
    
    const actualW = el.width || w;
    const actualH = el.height || h;
    
    if (el.x < minX) minX = el.x;
    if (el.y < minY) minY = el.y;
    if (el.x + actualW > maxX) maxX = el.x + actualW;
    if (el.y + actualH > maxY) maxY = el.y + actualH;
  });

  // Add dynamic padding around coordinate tree
  const padding = 100;
  minX -= padding;
  minY -= padding;
  maxX += padding;
  maxY += padding;

  if (minX < 0) minX = 0;
  if (minY < 0) minY = 0;

  const width = maxX - minX;
  const height = maxY - minY;

  // Enforce a minimum scale size of 1000 pixels
  const finalWidth = Math.max(width, 1000);
  const finalHeight = finalWidth * (2 / 3); // Fit exactly the 3:2 viewport aspect ratio

  // Center nodes vertically if height is less than final calculated height
  const actualHeight = maxY - minY;
  if (actualHeight < finalHeight) {
    minY -= (finalHeight - actualHeight) / 2;
    if (minY < 0) minY = 0;
  }

  return `${minX} ${minY} ${finalWidth} ${finalHeight}`;
});
</script>
