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

// Barycenter + union-find clustering ordering heuristic.
// Actor-to-usecase associations are the dominant connection type in most
// diagrams, so we compute each use case's "target y" as the average y of
// every actor connected to it (actors are placed first and have fixed y).
// Use cases with no actor connections receive a neutral/median target.
// Then we form clusters via union-find over include/extend/generalization
// pairs so that related use cases stay together. Each cluster's sort key is
// the mean barycenter target of its members (tie-break by earliest index).
// Finally, we sort clusters by that key and flatten — this keeps
// semantically related use cases adjacent without a pairwise nudge pass.
const orderUseCasesByBarycenterAndAdjacency = (useCases, connections, actorYById) => {
  if (useCases.length <= 1) return useCases.map((u) => u.id)

  const actorConns = new Map()
  const adjacencyConns = []

  connections.forEach((c) => {
    const fromActor = actorYById.has(c.from)
    const toActor = actorYById.has(c.to)
    const fromUC = useCases.some((u) => u.id === c.from)
    const toUC = useCases.some((u) => u.id === c.to)

    if (fromActor && toUC) {
      if (!actorConns.has(c.to)) actorConns.set(c.to, new Set())
      actorConns.get(c.to).add(c.from)
    } else if (fromUC && toActor) {
      if (!actorConns.has(c.from)) actorConns.set(c.from, new Set())
      actorConns.get(c.from).add(c.to)
    }

    if (fromUC && toUC && ADJACENCY_TYPES.includes(c.type)) {
      adjacencyConns.push({ from: c.from, to: c.to })
    }
  })

  const getTargetY = (ucId) => {
    const connectedActors = actorConns.get(ucId)
    if (!connectedActors || connectedActors.size === 0) {
      const targets = useCases
        .map((u) => {
          const actors = actorConns.get(u.id)
          if (!actors || actors.size === 0) return null
          const ys = [...actors].map((a) => actorYById.get(a)).filter((y) => y !== undefined)
          return ys.length > 0 ? ys.reduce((s, y) => s + y, 0) / ys.length : null
        })
        .filter((t) => t !== null)
      if (targets.length === 0) return 0
      targets.sort((a, b) => a - b)
      return targets[Math.floor(targets.length / 2)]
    }
    const ys = [...connectedActors].map((a) => actorYById.get(a)).filter((y) => y !== undefined)
    return ys.length > 0 ? ys.reduce((s, y) => s + y, 0) / ys.length : 0
  }

  const useCaseMeta = useCases.map((u, index) => ({
    id: u.id,
    index,
    target: getTargetY(u.id)
  }))

  const parent = new Map()
  const rank = new Map()
  useCases.forEach((u) => {
    parent.set(u.id, u.id)
    rank.set(u.id, 0)
  })

  const find = (id) => {
    let root = parent.get(id)
    if (root === undefined) return id
    while (root !== parent.get(root)) {
      root = parent.get(root)
    }
    let current = id
    while (current !== root) {
      const next = parent.get(current)
      parent.set(current, root)
      current = next
    }
    return root
  }

  const union = (a, b) => {
    const rootA = find(a)
    const rootB = find(b)
    if (rootA === rootB) return

    const rankA = rank.get(rootA) || 0
    const rankB = rank.get(rootB) || 0
    if (rankA < rankB) {
      parent.set(rootA, rootB)
    } else if (rankA > rankB) {
      parent.set(rootB, rootA)
    } else {
      parent.set(rootB, rootA)
      rank.set(rootA, rankA + 1)
    }
  }

  adjacencyConns.forEach(({ from, to }) => union(from, to))

  const clusters = new Map()
  useCaseMeta.forEach((item) => {
    const root = find(item.id)
    if (!clusters.has(root)) {
      clusters.set(root, [])
    }
    clusters.get(root).push(item)
  })

  const clusterList = [...clusters.values()].map((members) => {
    const orderedMembers = [...members].sort((a, b) => a.target - b.target || a.index - b.index)
    const clusterTarget = orderedMembers.reduce((sum, member) => sum + member.target, 0) / orderedMembers.length
    const clusterIndex = Math.min(...orderedMembers.map((member) => member.index))
    return { target: clusterTarget, index: clusterIndex, members: orderedMembers }
  })

  clusterList.sort((a, b) => a.target - b.target || a.index - b.index)

  return clusterList.flatMap((cluster) => cluster.members.map((member) => member.id))
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

  const actorYById = new Map()

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
    actorYById.set(el.id, el.y)
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
  const orderedIds = orderUseCasesByBarycenterAndAdjacency(useCases, connections, actorYById)
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
