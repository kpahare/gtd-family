import { create } from 'zustand';
import { apiClient } from '../api/client';
import { Context } from '../types';

interface ContextsState {
  contexts: Context[];
  isLoading: boolean;
  fetchContexts: () => Promise<void>;
  addContext: (name: string, color?: string) => Promise<void>;
  updateContext: (id: string, data: Partial<Context>) => Promise<void>;
  deleteContext: (id: string) => Promise<void>;
}

export const useContextsStore = create<ContextsState>((set, get) => ({
  contexts: [],
  isLoading: false,

  fetchContexts: async () => {
    set({ isLoading: true });
    try {
      const contexts = await apiClient.getContexts();
      set({ contexts, isLoading: false });
    } catch {
      set({ isLoading: false });
    }
  },

  addContext: async (name, color) => {
    const context = await apiClient.createContext({ name, color });
    set({ contexts: [...get().contexts, context] });
  },

  updateContext: async (id, data) => {
    const updated = await apiClient.updateContext(id, data);
    set({ contexts: get().contexts.map((c) => (c.id === id ? updated : c)) });
  },

  deleteContext: async (id) => {
    await apiClient.deleteContext(id);
    set({ contexts: get().contexts.filter((c) => c.id !== id) });
  },
}));
