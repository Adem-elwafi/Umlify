import { getElementDimensions } from '../utils/connectorRouting'

const GRID = 20

export const ADJACENCY_TYPES = ['include', 'extend', 'generalization']

const snap = (value) => Math.round(value / GRID) * GRID

const roundDimensions = (type, label) => {
  const { width, height } = getElementDimensions({ type })
  return { width, height, label }
}

const estimateLabelWidth = (label = '', base = 140) => {
  const chars = String(label).length
  const estimated = Math.max(base, chars * 8 + 40)
  return snap(estimated)
}

// Deterministic adjacency-sort heuristic.
// Returns use-case ids ordered so that use cases sharing an
// include/extend/generalization link land adjacent where possible.
// This is a simple greedy neighbor-grouping pass, NOT full crossing-minimization.
const orderUseCasesByAdjacency = (useCases, connections) => {
  if (useCases.length <= 2) return useCases.map((u) => u.id)

  const adjacency = new Map()
  useCases.forEach((u) => adjacency.set(u.id, new Set()))
  connections.forEach((c) => {
    if (!ADJACENCY_TYPES.includes(c.type)) return
    const a = useCases.find((u) => u.id === c.from)
    const b = useCases.find((u) => u.id === c.to)
    if (a && b) {
      adjacency.get(a.id).add(b.id)
      adjacency.get(b.id).add(a.id)
    }
  })

  const ordered = []
  const visited = new Set()

  const start = useCases[0].id
  const queue = [start]
  while (queue.length) {
    const current = queue.shift()
    if (visited.has(current)) continue
    visited.add(current)
    ordered.push(current)
    const neighbors = [...adjacency.get(current)].filter((n) => !visited.has(n))
    queue.unshift(...neighbors)
  }

  // Append any use cases that were never reached (disconnected from the graph).
  useCases.forEach((u) => {
    if (!visited.has(u.id)) ordered.push(u.id)
  })

  return ordered
}

// Estimate the width a use-case label needs; the System box must be wide enough.
const computeSystemWidth = (useCases) => {
  const base = getElementDimensions({ type: 'System' }).width
  const maxUseCaseWidth = useCases.reduce((max, u) => {
    const w = estimateLabelWidth(u.label, getElementDimensions({ type: 'usecase' }).width)
    return Math.max(max, w)
  }, getElementDimensions({ type: 'usecase' }).width)
  const padding = 60
  return snap(Math.max(base, maxUseCaseWidth + padding))
}

// Compute horizontal/vertical sides from relative final positions of two elements.
const computeSides = (fromEl, toEl) => {
  const fromCenterX = fromEl.x + fromEl.width / 2
  const fromCenterY = fromEl.y + fromEl.height / 2
  const toCenterX = toEl.x + toEl.width / 2
  const toCenterY = toEl.y + toEl.height / 2

  const dx = toCenterX - fromCenterX
  const dy = toCenterY - fromCenterY

  let fromSide
  let toSide
  if (Math.abs(dx) >= Math.abs(dy)) {
    if (dx >= 0) {
      fromSide = 'right'
      toSide = 'left'
    } else {
      fromSide = 'left'
      toSide = 'right'
    }
  } else {
    if (dy >= 0) {
      fromSide = 'bottom'
      toSide = 'top'
    } else {
      fromSide = 'top'
      toSide = 'bottom'
    }
  }
  return { fromSide, toSide }
}

/**
 * Pure, deterministic layout engine for AI-generated Use Case diagrams.
 *
 * Takes the semantic payload produced by the LLM (actors, system, useCases,
 * connections — no coordinates, no connection sides) and returns fully
 * positioned elements + connections ready to be consumed by the diagram store.
 *
 * @param {Object} payload - Semantic payload
 * @param {Array<{id:string,label:string}>} [payload.actors]
 * @param {{id:string,label:string}} [payload.system]
 * @param {Array<{id:string,label:string}>} [payload.useCases]
 * @param {Array<{from:string,to:string,type:string}>} [payload.connections]
 * @returns {{ elements: Array<{id,type,label,x,y,width,height}>, connections: Array<{from,to,fromSide,toSide,type}> }}
 */
export function layoutUseCaseDiagram(payload = {}) {
  const actors = Array.isArray(payload.actors) ? payload.actors : []
  const system = payload.system || { id: 'system', label: 'System' }
  const useCases = Array.isArray(payload.useCases) ? payload.useCases : []
  const connections = Array.isArray(payload.connections) ? payload.connections : []

  const actorDim = roundDimensions('actor')
  const systemDim = roundDimensions('System')
  const useCaseDim = roundDimensions('usecase')

  const ACTOR_X = 80
  const SYSTEM_GAP = 80
  const USECASE_TOP_PADDING = 60
  const USECASE_BOTTOM_PADDING = 60
  const USECASE_GAP = 40

  const elements = []
  const elementMap = {}

  // --- Actors: single vertical column, centered against total diagram height ---
  const totalDiagramHeight = snap(
    Math.max(
      actors.length * (actorDim.height + USECASE_GAP) + USECASE_TOP_PADDING + USECASE_BOTTOM_PADDING,
      useCases.length * (useCaseDim.height + USECASE_GAP) + USECASE_TOP_PADDING + USECASE_BOTTOM_PADDING,
      systemDim.height
    )
  )

  const actorSpacing = actors.length > 0
    ? totalDiagramHeight / actors.length
    : 0

  actors.forEach((actor, i) => {
    const el = {
      id: actor.id,
      type: 'actor',
      label: actor.label || 'Actor',
      x: snap(ACTOR_X),
      y: snap(actorSpacing * i + (actorSpacing - actorDim.height) / 2),
      width: actorDim.width,
      height: actorDim.height
    }
    elements.push(el)
    elementMap[el.id] = el
  })

  // --- System: right of actor column, sized by use-case count + padding ---
  const systemX = snap(ACTOR_X + actorDim.width + SYSTEM_GAP)

  const useCaseBlockHeight = useCases.length > 0
    ? useCases.length * useCaseDim.height + (useCases.length - 1) * USECASE_GAP
    : 0
  const systemHeight = snap(
    Math.max(
      systemDim.height,
      useCaseBlockHeight + USECASE_TOP_PADDING + USECASE_BOTTOM_PADDING
    )
  )
  const systemWidth = computeSystemWidth(useCases)

  const systemEl = {
    id: system.id,
    type: 'System',
    label: system.label || 'System',
    x: systemX,
    y: snap((totalDiagramHeight - systemHeight) / 2),
    width: systemWidth,
    height: systemHeight
  }
  elements.push(systemEl)
  elementMap[systemEl.id] = systemEl

  // --- Use cases: stacked vertically inside the System box, centered ---
  const orderedIds = orderUseCasesByAdjacency(useCases, connections)
  const orderedUseCases = orderedIds
    .map((id) => useCases.find((u) => u.id === id))
    .filter(Boolean)

  const totalBlock = orderedUseCases.length * useCaseDim.height + Math.max(0, orderedUseCases.length - 1) * USECASE_GAP
  const startY = snap(systemEl.y + (systemHeight - totalBlock) / 2)

  orderedUseCases.forEach((uc, i) => {
    const el = {
      id: uc.id,
      type: 'usecase',
      label: uc.label || 'Use Case',
      x: snap(systemEl.x + (systemWidth - useCaseDim.width) / 2),
      y: snap(startY + i * (useCaseDim.height + USECASE_GAP)),
      width: useCaseDim.width,
      height: useCaseDim.height
    }
    elements.push(el)
    elementMap[el.id] = el
  })

  // --- Connections: resolve sides from final relative positions ---
  const outConnections = connections
    .map((conn) => {
      const fromEl = elementMap[conn.from]
      const toEl = elementMap[conn.to]
      if (!fromEl || !toEl) return null
      const { fromSide, toSide } = computeSides(fromEl, toEl)
      return {
        from: conn.from,
        to: conn.to,
        fromSide,
        toSide,
        type: conn.type || 'association'
      }
    })
    .filter(Boolean)

  return { elements, connections: outConnections }
}
