import { create } from 'zustand';
import { apiClient } from '../api/client';
import { Project, ProjectHorizon, ProjectStatus } from '../types';

interface ProjectsState {
  projects: Project[];
  currentProject: Project | null;
  isLoading: boolean;
  fetchProjects: (horizon?: ProjectHorizon, status?: ProjectStatus) => Promise<void>;
  fetchProject: (id: string) => Promise<void>;
  addProject: (name: string, description?: string, horizon?: ProjectHorizon) => Promise<void>;
  updateProject: (id: string, data: Partial<Project>) => Promise<void>;
  deleteProject: (id: string) => Promise<void>;
}

export const useProjectsStore = create<ProjectsState>((set, get) => ({
  projects: [],
  currentProject: null,
  isLoading: false,

  fetchProjects: async (horizon, status) => {
    set({ isLoading: true });
    try {
      const projects = await apiClient.getProjects({ horizon, status });
      set({ projects, isLoading: false });
    } catch {
      set({ isLoading: false });
    }
  },

  fetchProject: async (id) => {
    set({ isLoading: true });
    try {
      const project = await apiClient.getProject(id);
      set({ currentProject: project, isLoading: false });
    } catch {
      set({ isLoading: false });
    }
  },

  addProject: async (name, description, horizon = 'project') => {
    const project = await apiClient.createProject({ name, description, horizon });
    set({ projects: [project, ...get().projects] });
  },

  updateProject: async (id, data) => {
    const updated = await apiClient.updateProject(id, data);
    set({
      projects: get().projects.map((p) => (p.id === id ? updated : p)),
      currentProject: get().currentProject?.id === id ? updated : get().currentProject,
    });
  },

  deleteProject: async (id) => {
    await apiClient.deleteProject(id);
    set({
      projects: get().projects.filter((p) => p.id !== id),
      currentProject: get().currentProject?.id === id ? null : get().currentProject,
    });
  },
}));
