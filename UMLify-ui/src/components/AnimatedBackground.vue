<template>
  <div class="animated-bg-wrapper">
    <!-- Luxury Preloading Screen -->
    <Transition name="fade">
      <div v-if="isLoading" class="loader-overlay">
        <div class="loader-content">
          <div class="loader-logo">UMLIFY</div>
          <div class="loader-progress-container">
            <div class="loader-progress-bar" :style="{ width: `${progressPercent}%` }"></div>
          </div>
          <div class="loader-status">
            <span>PRELOADING SYSTEM CORE</span>
            <span class="mono">{{ progressPercent }}%</span>
          </div>
          <div class="loader-details mono">
            FRAME {{ loadedCount }} / {{ totalFrames }} // BUFFERING ASSETS
          </div>
        </div>
      </div>
    </Transition>

    <!-- Canvas Container (Applied parallax and breathing transforms) -->
    <div 
      ref="containerRef" 
      class="animated-bg-container"
      :class="{ 'is-loaded': !isLoading, 'position-fixed': fixed, 'position-absolute': !fixed }"
    >
      <canvas ref="canvasRef" class="animated-bg-canvas"></canvas>
      <!-- Premium Overlay Gradients for Depth (Stripe / Apple aesthetic) -->
      <div class="vignette-overlay"></div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, computed } from 'vue';

const props = defineProps({
  fixed: {
    type: Boolean,
    default: true
  },
  fps: {
    type: Number,
    default: 30
  },
  breathingPeriod: {
    type: Number,
    default: 14000 // 14 seconds in ms
  },
  parallaxAmount: {
    type: Number,
    default: 100 // max translateY in px
  }
});

// Load all frames from the frames folder automatically using Vite's glob import
const framesGlob = import.meta.glob('../frames/*.png', { eager: true });

// Sort keys numerically so frame 2 comes after frame 1, and frame 10 comes after frame 9
const frameUrls = Object.keys(framesGlob)
  .sort((a, b) => {
    const numA = parseInt(a.match(/\d+/)?.[0] || '0', 10);
    const numB = parseInt(b.match(/\d+/)?.[0] || '0', 10);
    return numA - numB;
  })
  .map(key => framesGlob[key].default || framesGlob[key]);

const totalFrames = frameUrls.length;
const loadedCount = ref(0);
const isLoading = ref(true);
const containerRef = ref(null);
const canvasRef = ref(null);

const progressPercent = computed(() => {
  if (totalFrames === 0) return 0;
  return Math.round((loadedCount.value / totalFrames) * 100);
});

// Canvas context and preloaded images
let ctx = null;
const images = [];
let animationFrameId = null;

// Animation timing states (Locked at 30 FPS)
let currentFrameIndex = 0;
const frameInterval = 1000 / props.fps;
let lastFrameTime = 0;

// Parallax scrolling states
let currentY = 0;
let targetY = 0;
const lerpSpeed = 0.08; // smooth interpolation speed

// Preload all frames sequentially
const preloadFrames = () => {
  if (totalFrames === 0) {
    isLoading.value = false;
    return;
  }

  let loaded = 0;
  frameUrls.forEach((url, index) => {
    const img = new Image();
    img.src = url;
    
    img.onload = () => {
      loaded++;
      loadedCount.value = loaded;
      if (loaded === totalFrames) {
        // All frames loaded. Delay slightly to allow final decode and smooth transition
        setTimeout(() => {
          isLoading.value = false;
          startAnimation();
        }, 300);
      }
    };

    img.onerror = (err) => {
      console.warn(`Failed to preload frame: ${url}. Continuing.`, err);
      loaded++;
      loadedCount.value = loaded;
      if (loaded === totalFrames) {
        setTimeout(() => {
          isLoading.value = false;
          startAnimation();
        }, 300);
      }
    };

    images[index] = img;
  });
};

// Canvas drawing loop (handles aspect-ratio cover and devicePixelRatio crispness)
const drawCurrentFrame = () => {
  const canvas = canvasRef.value;
  if (!canvas || !ctx || images.length === 0) return;

  const img = images[currentFrameIndex];
  if (!img || !img.complete) return;

  const dpr = window.devicePixelRatio || 1;
  const canvasWidth = canvas.width / dpr;
  const canvasHeight = canvas.height / dpr;

  const imgWidth = img.naturalWidth;
  const imgHeight = img.naturalHeight;

  if (imgWidth === 0 || imgHeight === 0) return;

  // Clear canvas
  ctx.clearRect(0, 0, canvasWidth, canvasHeight);

  // Replicate CSS object-fit: cover
  const canvasRatio = canvasWidth / canvasHeight;
  const imgRatio = imgWidth / imgHeight;

  let sWidth = imgWidth;
  let sHeight = imgHeight;
  let sx = 0;
  let sy = 0;

  if (imgRatio > canvasRatio) {
    sWidth = imgHeight * canvasRatio;
    sx = (imgWidth - sWidth) / 2;
  } else {
    sHeight = imgWidth / canvasRatio;
    sy = (imgHeight - sHeight) / 2;
  }

  ctx.drawImage(img, sx, sy, sWidth, sHeight, 0, 0, canvasWidth, canvasHeight);
};

// Resize handler (adds vertical offset buffer to prevent white gaps during translation)
const handleResize = () => {
  const canvas = canvasRef.value;
  if (!canvas) return;

  const dpr = window.devicePixelRatio || 1;
  const width = window.innerWidth;
  // Canvas height includes extra padding for the maximum parallax offset translation
  const height = window.innerHeight + props.parallaxAmount + 20;

  canvas.width = width * dpr;
  canvas.height = height * dpr;

  ctx = canvas.getContext('2d');
  if (ctx) {
    ctx.scale(dpr, dpr);
  }

  drawCurrentFrame();
};

// Parallax scroll handler
const handleScroll = () => {
  const scrollTop = window.scrollY || document.documentElement.scrollTop;
  const range = window.innerHeight || 800;
  // Translate up to -parallaxAmount px when user scrolls down by 1 viewport height
  const pct = Math.min(1, Math.max(0, scrollTop / range));
  targetY = pct * -props.parallaxAmount;
};

// Main requestAnimationFrame tick loop
const animate = (timestamp) => {
  if (!lastFrameTime) lastFrameTime = timestamp;
  const elapsed = timestamp - lastFrameTime;

  // 1. Advance frames at target 30 FPS
  if (elapsed >= frameInterval) {
    currentFrameIndex = (currentFrameIndex + 1) % totalFrames;
    drawCurrentFrame();
    // Adjust lastFrameTime while keeping fractional intervals accurate
    lastFrameTime = timestamp - (elapsed % frameInterval);
  }

  // 2. Interpolate scroll position smoothly
  currentY += (targetY - currentY) * lerpSpeed;

  // 3. Trigonometric breathing effect (scale(1.0) to scale(1.02))
  // Uses cosine phase shift so scale starts precisely at 1.00 when timestamp = 0
  const angle = (timestamp / props.breathingPeriod) * 2 * Math.PI;
  const breathingScale = 1.01 - Math.cos(angle) * 0.01;

  // 4. Update container transform using hardware acceleration (will-change)
  if (containerRef.value) {
    containerRef.value.style.transform = `translate3d(0, ${currentY.toFixed(3)}px, 0) scale(${breathingScale.toFixed(5)})`;
  }

  animationFrameId = requestAnimationFrame(animate);
};

const startAnimation = () => {
  handleResize();
  handleScroll();
  animationFrameId = requestAnimationFrame(animate);
};

onMounted(() => {
  preloadFrames();
  window.addEventListener('resize', handleResize, { passive: true });
  window.addEventListener('scroll', handleScroll, { passive: true });
});

onUnmounted(() => {
  cancelAnimationFrame(animationFrameId);
  window.removeEventListener('resize', handleResize);
  window.removeEventListener('scroll', handleScroll);
});
</script>

<style scoped>
.animated-bg-wrapper {
  position: relative;
  width: 100%;
  height: 100%;
}

/* Premium minimalist loading overlay */
.loader-overlay {
  position: fixed;
  inset: 0;
  background-color: #0b0f19;
  z-index: 9999;
  display: flex;
  justify-content: center;
  align-items: center;
  color: #f1f5f9;
  font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
}

.loader-content {
  width: 280px;
  display: flex;
  flex-direction: column;
  align-items: stretch;
}

.loader-logo {
  font-size: 1.5rem;
  font-weight: 800;
  letter-spacing: 0.25em;
  text-align: center;
  margin-bottom: 2rem;
  background: linear-gradient(135deg, #ffffff 30%, rgba(255, 255, 255, 0.4) 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  text-shadow: 0 0 30px rgba(255, 255, 255, 0.1);
}

.loader-progress-container {
  height: 2px;
  background-color: rgba(241, 245, 249, 0.1);
  border-radius: 9999px;
  overflow: hidden;
  margin-bottom: 0.75rem;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.5);
}

.loader-progress-bar {
  height: 100%;
  background: linear-gradient(90deg, #9ca3af, #ffffff);
  box-shadow: 0 0 8px rgba(255, 255, 255, 0.5);
  transition: width 0.1s ease-out;
}

.loader-status {
  display: flex;
  justify-content: space-between;
  font-size: 0.65rem;
  letter-spacing: 0.15em;
  font-weight: 600;
  color: #9ca3af;
  margin-bottom: 0.5rem;
}

.loader-details {
  font-size: 0.55rem;
  color: #4b5563;
  letter-spacing: 0.1em;
  text-align: center;
}

.mono {
  font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
}

/* Background Container & Canvas */
.animated-bg-container {
  top: 0;
  left: 0;
  width: 100vw;
  /* Add translation height buffer to the container element */
  height: calc(100vh + 120px);
  overflow: hidden;
  pointer-events: none;
  opacity: 0;
  transition: opacity 1.5s cubic-bezier(0.16, 1, 0.3, 1);
  will-change: transform;
  transform-origin: center center;
}

.animated-bg-container.is-loaded {
  opacity: 1;
}

.position-fixed {
  position: fixed;
  z-index: 0;
}

.position-absolute {
  position: absolute;
  z-index: 0;
}

.animated-bg-canvas {
  width: 100%;
  height: 100%;
  display: block;
}

/* Premium Vignette Overlay for Depth & High Contrast Contrast */
.vignette-overlay {
  position: absolute;
  inset: 0;
  background: 
    radial-gradient(circle at center, transparent 30%, rgba(11, 15, 25, 0.2) 100%),
    linear-gradient(to bottom, rgba(11, 15, 25, 0.3) 0%, transparent 15%, transparent 85%, rgba(11, 15, 25, 0.5) 100%);
  pointer-events: none;
}

/* Vue Transitions */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.8s cubic-bezier(0.16, 1, 0.3, 1);
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
