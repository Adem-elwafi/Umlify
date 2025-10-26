import { ref } from 'vue'

export function useDiagramStore() {
  const actors = ref([])
  const useCases = ref([])
  const connections = ref([])
  const selectedTool = ref('select')
  const selectedElement = ref(null)

  const addActor = (position) => {
    const actor = {
      id: `actor-${Date.now()}`,
      type: 'actor',
      position
    }
    actors.value.push(actor)
    return actor
  }

  const addUseCase = (position, title = 'Use Case') => {
    const useCase = {
      id: `usecase-${Date.now()}`,
      type: 'useCase',
      position,
      title
    }
    useCases.value.push(useCase)
    return useCase
  }

  const addConnection = (start, end) => {
    const connection = {
      id: `connection-${Date.now()}`,
      type: 'connection',
      start,
      end
    }
    connections.value.push(connection)
    return connection
  }

  const removeElement = (id) => {
    actors.value = actors.value.filter(a => a.id !== id)
    useCases.value = useCases.value.filter(u => u.id !== id)
    connections.value = connections.value.filter(c => c.id !== id)
  }

  const updateElementPosition = (id, newPosition) => {
    const actor = actors.value.find(a => a.id === id)
    if (actor) {
      actor.position = newPosition
      return
    }

    const useCase = useCases.value.find(u => u.id === id)
    if (useCase) {
      useCase.position = newPosition
    }
  }

  return {
    actors,
    useCases,
    connections,
    selectedTool,
    selectedElement,
    addActor,
    addUseCase,
    addConnection,
    removeElement,
    updateElementPosition
  }
}
