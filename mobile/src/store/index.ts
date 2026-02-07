import { create } from 'zustand';
import { apiClient } from '../api/client';
import {
  User,
  Item,
  ItemType,
  Project,
  ProjectHorizon,
  Context,
  Family,
  FamilyMember,
  WeeklyReview,
  ReviewChecklistItem,
} from '../types';

interface AuthState {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, name: string) => Promise<void>;
  logout: () => Promise<void>;
  checkAuth: () => Promise<void>;
}

interface ItemsState {
  items: Item[];
  isLoading: boolean;
  fetchItems: (type?: ItemType) => Promise<void>;
  addItem: (title: string, type?: ItemType) => Promise<void>;
  updateItem: (id: string, data: Partial<Item>) => Promise<void>;
  deleteItem: (id: string) => Promise<void>;
  completeItem: (id: string) => Promise<void>;
  processItem: (id: string, type: ItemType, contextId?: string, projectId?: string) => Promise<void>;
}

interface ProjectsState {
  projects: Project[];
  isLoading: boolean;
  fetchProjects: (horizon?: ProjectHorizon) => Promise<void>;
  addProject: (name: string, horizon?: ProjectHorizon) => Promise<void>;
  updateProject: (id: string, data: Partial<Project>) => Promise<void>;
  deleteProject: (id: string) => Promise<void>;
}

interface ContextsState {
  contexts: Context[];
  isLoading: boolean;
  fetchContexts: () => Promise<void>;
  addContext: (name: string, color?: string) => Promise<void>;
  updateContext: (id: string, data: Partial<Context>) => Promise<void>;
  deleteContext: (id: string) => Promise<void>;
}

interface FamilyState {
  families: Family[];
  members: FamilyMember[];
  isLoading: boolean;
  fetchFamilies: () => Promise<void>;
  createFamily: (name: string) => Promise<void>;
  joinFamily: (inviteCode: string) => Promise<void>;
  fetchMembers: (familyId: string) => Promise<void>;
}

interface ReviewState {
  reviews: WeeklyReview[];
  checklist: ReviewChecklistItem[];
  isLoading: boolean;
  fetchChecklist: () => Promise<void>;
  fetchReviews: () => Promise<void>;
  completeReview: (notes?: string) => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isLoading: true,
  isAuthenticated: false,

  login: async (email, password) => {
    set({ isLoading: true });
    try {
      const user = await apiClient.login(email, password);
      set({ user, isAuthenticated: true, isLoading: false });
    } catch (error) {
      set({ isLoading: false });
      throw error;
    }
  },

  register: async (email, password, name) => {
    set({ isLoading: true });
    try {
      await apiClient.register(email, password, name);
      const user = await apiClient.login(email, password);
      set({ user, isAuthenticated: true, isLoading: false });
    } catch (error) {
      set({ isLoading: false });
      throw error;
    }
  },

  logout: async () => {
    await apiClient.logout();
    set({ user: null, isAuthenticated: false });
  },

  checkAuth: async () => {
    set({ isLoading: true });
    await apiClient.init();
    if (apiClient.isAuthenticated()) {
      try {
        const user = await apiClient.getCurrentUser();
        set({ user, isAuthenticated: true, isLoading: false });
      } catch {
        set({ isLoading: false });
      }
    } else {
      set({ isLoading: false });
    }
  },
}));

export const useItemsStore = create<ItemsState>((set, get) => ({
  items: [],
  isLoading: false,

  fetchItems: async (type) => {
    set({ isLoading: true });
    try {
      const items = await apiClient.getItems({ type });
      set({ items, isLoading: false });
    } catch {
      set({ isLoading: false });
    }
  },

  addItem: async (title, type = 'inbox') => {
    const item = await apiClient.createItem({ title, type });
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

  processItem: async (id, type, contextId, projectId) => {
    const updated = await apiClient.processItem(id, {
      type,
      context_id: contextId,
      project_id: projectId,
    });
    set({ items: get().items.map((i) => (i.id === id ? updated : i)) });
  },
}));

export const useProjectsStore = create<ProjectsState>((set, get) => ({
  projects: [],
  isLoading: false,

  fetchProjects: async (horizon) => {
    set({ isLoading: true });
    try {
      const projects = await apiClient.getProjects({ horizon });
      set({ projects, isLoading: false });
    } catch {
      set({ isLoading: false });
    }
  },

  addProject: async (name, horizon = 'project') => {
    const project = await apiClient.createProject({ name, horizon });
    set({ projects: [project, ...get().projects] });
  },

  updateProject: async (id, data) => {
    const updated = await apiClient.updateProject(id, data);
    set({ projects: get().projects.map((p) => (p.id === id ? updated : p)) });
  },

  deleteProject: async (id) => {
    await apiClient.deleteProject(id);
    set({ projects: get().projects.filter((p) => p.id !== id) });
  },
}));

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

export const useFamilyStore = create<FamilyState>((set, get) => ({
  families: [],
  members: [],
  isLoading: false,

  fetchFamilies: async () => {
    set({ isLoading: true });
    try {
      const families = await apiClient.getFamilies();
      set({ families, isLoading: false });
    } catch {
      set({ isLoading: false });
    }
  },

  createFamily: async (name) => {
    const family = await apiClient.createFamily(name);
    set({ families: [...get().families, family] });
  },

  joinFamily: async (inviteCode) => {
    const family = await apiClient.joinFamily(inviteCode);
    set({ families: [...get().families, family] });
  },

  fetchMembers: async (familyId) => {
    set({ isLoading: true });
    try {
      const members = await apiClient.getFamilyMembers(familyId);
      set({ members, isLoading: false });
    } catch {
      set({ isLoading: false });
    }
  },
}));

export const useReviewStore = create<ReviewState>((set, get) => ({
  reviews: [],
  checklist: [],
  isLoading: false,

  fetchChecklist: async () => {
    set({ isLoading: true });
    try {
      const checklist = await apiClient.getReviewChecklist();
      set({ checklist, isLoading: false });
    } catch {
      set({ isLoading: false });
    }
  },

  fetchReviews: async () => {
    set({ isLoading: true });
    try {
      const reviews = await apiClient.getReviews();
      set({ reviews, isLoading: false });
    } catch {
      set({ isLoading: false });
    }
  },

  completeReview: async (notes) => {
    const review = await apiClient.createReview(notes);
    set({ reviews: [review, ...get().reviews] });
  },
}));
