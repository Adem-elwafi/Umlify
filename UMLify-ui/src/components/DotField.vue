<template>
  <canvas
    ref="canvasRef"
    class="w-full h-full block"
  />
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount, watch } from 'vue'

const props = defineProps({
  dotRadius: {
    type: Number,
    default: 2.5
  },
  dotSpacing: {
    type: Number,
    default: 17
  },
  cursorRadius: {
    type: Number,
    default: 500
  },
  cursorForce: {
    type: Number,
    default: 0.1
  },
  bulgeOnly: {
    type: Boolean,
    default: true
  },
  bulgeStrength: {
    type: Number,
    default: 67
  },
  glowRadius: {
    type: Number,
    default: 160
  },
  sparkle: {
    type: Boolean,
    default: false
  },
  waveAmplitude: {
    type: Number,
    default: 0
  },
  gradientFrom: {
    type: String,
    default: "rgba(168, 85, 247, 0.35)"
  },
  gradientTo: {
    type: String,
    default: "rgba(180, 151, 207, 0.25)"
  },
  glowColor: {
    type: String,
    default: "#120F17"
  }
})

const canvasRef = ref(null)
const mouse = ref({ x: null, y: null })

let animationFrameId = null
let dots = []
let width = 0
let height = 0

const initDots = () => {
  if (!canvasRef.value) return
  const canvas = canvasRef.value
  
  const dpr = window.devicePixelRatio || 1
  width = canvas.width = canvas.offsetWidth * dpr
  height = canvas.height = canvas.offsetHeight * dpr
  
  const ctx = canvas.getContext('2d')
  if (ctx) {
    ctx.scale(dpr, dpr)
  }
  
  const displayWidth = canvas.offsetWidth
  const displayHeight = canvas.offsetHeight

  dots = []
  const spacing = props.dotSpacing
  for (let x = 0; x < displayWidth + spacing; x += spacing) {
    for (let y = 0; y < displayHeight + spacing; y += spacing) {
      dots.push({
        x0: x,
        y0: y,
        x: x,
        y: y,
        sparkleFactor: Math.random()
      })
    }
  }
}

const handleGlobalMouseMove = (e) => {
  if (!canvasRef.value) return
  const rect = canvasRef.value.getBoundingClientRect()
  
  // Calculate relative mouse coordinates on the canvas
  const mx = e.clientX - rect.left
  const my = e.clientY - rect.top
  
  // Set coordinates if the cursor is near the canvas area
  const margin = 100
  if (
    mx >= -margin &&
    mx <= rect.width + margin &&
    my >= -margin &&
    my <= rect.height + margin
  ) {
    mouse.value.x = mx
    mouse.value.y = my
  } else {
    mouse.value.x = null
    mouse.value.y = null
  }
}

const handleGlobalMouseLeave = () => {
  mouse.value.x = null
  mouse.value.y = null
}

const updateAndRender = () => {
  if (!canvasRef.value) return
  const canvas = canvasRef.value
  const ctx = canvas.getContext('2d')
  if (!ctx) return

  const displayWidth = canvas.offsetWidth
  const displayHeight = canvas.offsetHeight

  ctx.clearRect(0, 0, displayWidth, displayHeight)

  const mx = mouse.value.x
  const my = mouse.value.y

  // 1. Draw Glow under the dots
  if (mx !== null && my !== null && props.glowRadius > 0) {
    const glow = ctx.createRadialGradient(mx, my, 0, mx, my, props.glowRadius)
    glow.addColorStop(0, props.glowColor)
    glow.addColorStop(1, 'transparent')
    ctx.fillStyle = glow
    ctx.beginPath()
    ctx.arc(mx, my, props.glowRadius, 0, Math.PI * 2)
    ctx.fill()
  }

  // 2. Draw Dots
  ctx.beginPath()
  const time = Date.now() * 0.002

  dots.forEach(dot => {
    let targetX = dot.x0
    let targetY = dot.y0

    if (props.waveAmplitude > 0) {
      targetY += Math.sin(dot.x0 * 0.05 + time) * props.waveAmplitude
    }

    if (mx !== null && my !== null) {
      const dx = targetX - mx
      const dy = targetY - my
      const dist = Math.sqrt(dx * dx + dy * dy)

      if (dist < props.cursorRadius && dist > 0) {
        const influence = 1 - dist / props.cursorRadius
        
        if (props.bulgeOnly) {
          const shift = influence * props.bulgeStrength
          dot.x = targetX + (dx / dist) * shift
          dot.y = targetY + (dy / dist) * shift
        } else {
          const shift = influence * props.cursorRadius * props.cursorForce
          dot.x = targetX + (dx / dist) * shift
          dot.y = targetY + (dy / dist) * shift
        }
      } else {
        dot.x = targetX
        dot.y = targetY
      }
    } else {
      dot.x = targetX
      dot.y = targetY
    }

    let radius = props.dotRadius
    if (props.sparkle) {
      const sparkleChance = Math.sin(time + dot.sparkleFactor * 10) > 0.8
      if (sparkleChance) {
        radius = props.dotRadius * (1.2 + 0.8 * Math.sin(time * 5 + dot.sparkleFactor))
      }
    }

    ctx.moveTo(dot.x + radius, dot.y)
    ctx.arc(dot.x, dot.y, radius, 0, Math.PI * 2)
  })

  const grad = ctx.createLinearGradient(0, 0, displayWidth, displayHeight)
  grad.addColorStop(0, props.gradientFrom)
  grad.addColorStop(1, props.gradientTo)
  ctx.fillStyle = grad
  ctx.fill()

  animationFrameId = requestAnimationFrame(updateAndRender)
}

let resizeObserver = null

onMounted(() => {
  initDots()
  updateAndRender()
  
  if (window.ResizeObserver) {
    resizeObserver = new ResizeObserver(() => {
      initDots()
    })
    resizeObserver.observe(canvasRef.value)
  }
  
  window.addEventListener('resize', initDots)
  window.addEventListener('mousemove', handleGlobalMouseMove)
  document.addEventListener('mouseleave', handleGlobalMouseLeave)
})

onBeforeUnmount(() => {
  if (animationFrameId) {
    cancelAnimationFrame(animationFrameId)
  }
  if (resizeObserver) {
    resizeObserver.disconnect()
  }
  window.removeEventListener('resize', initDots)
  window.removeEventListener('mousemove', handleGlobalMouseMove)
  document.removeEventListener('mouseleave', handleGlobalMouseLeave)
})

watch(() => props.dotSpacing, initDots)
</script>
