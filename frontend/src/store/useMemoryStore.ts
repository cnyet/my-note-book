import { create } from 'zustand'

interface MemoryEntry {
  key: string
  value: any
  agent_id: string
}

interface MemoryState {
  memories: Record<string, MemoryEntry[]>
  addMemory: (agentId: string, entry: MemoryEntry) => void
  getMemories: (agentId: string) => MemoryEntry[]
}

export const useMemoryStore = create<MemoryState>((set, get) => ({
  memories: {},
  addMemory: (agentId, entry) => set((state) => ({
    memories: {
      ...state.memories,
      [agentId]: [...(state.memories[agentId] || []), entry]
    }
  })),
  getMemories: (agentId) => get().memories[agentId] || [],
}))
