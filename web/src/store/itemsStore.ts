import { create } from 'zustand';
import { apiClient } from '../api/client';
import { Item, ItemType } from '../types';

interface ItemsState {
  items: Item[];
  isLoading: boolean;
  fetchItems: (type?: ItemType, projectId?: string) => Promise<void>;
  addItem: (title: string, type?: ItemType, projectId?: string) => Promise<void>;
  updateItem: (id: string, data: Partial<Item>) => Promise<void>;
  deleteItem: (id: string) => Promise<void>;
  completeItem: (id: string) => Promise<void>;
  processItem: (
    id: string,
    type: ItemType,
    contextId?: string,
    projectId?: string,
    dueDate?: string,
    assignedTo?: string,
    priority?: string
  ) => Promise<void>;
}

export const useItemsStore = create<ItemsState>((set, get) => ({
  items: [],
  isLoading: false,

  fetchItems: async (type, projectId) => {
    set({ isLoading: true });
    try {
      const items = await apiClient.getItems({ type, project_id: projectId });
      set({ items, isLoading: false });
    } catch {
      set({ isLoading: false });
    }
  },

  addItem: async (title, type = 'inbox', projectId) => {
    const item = await apiClient.createItem({ title, type, project_id: projectId });
    set({ items: [item, ...get().items] });
  },

  updateItem: async (id, data) => {
    const updated = await apiClient.updateItem(id, data);
    set({ items: get().items.map((i) => (i.id === id ? updated : i)) });
  },

  deleteItem: async (id) => {
    await apiClient.deleteItem(id);
    set({ items: get().items.filter((i) => i.id !== id) });
  },

  completeItem: async (id) => {
    const updated = await apiClient.completeItem(id);
    set({ items: get().items.map((i) => (i.id === id ? updated : i)) });
  },

  processItem: async (id, type, contextId, projectId, dueDate, assignedTo, priority) => {
    const updated = await apiClient.processItem(id, {
      type,
      context_id: contextId,
      project_id: projectId,
      due_date: dueDate,
      assigned_to: assignedTo,
      priority,
    });
    set({ items: get().items.map((i) => (i.id === id ? updated : i)) });
  },
}));
