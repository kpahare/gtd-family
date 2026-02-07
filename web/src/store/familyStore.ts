import { create } from 'zustand';
import { apiClient } from '../api/client';
import { Family, FamilyMember } from '../types';

interface FamilyState {
  families: Family[];
  currentFamily: Family | null;
  members: FamilyMember[];
  isLoading: boolean;
  fetchFamilies: () => Promise<void>;
  createFamily: (name: string) => Promise<void>;
  joinFamily: (inviteCode: string) => Promise<void>;
  fetchMembers: (familyId: string) => Promise<void>;
  generateInvite: (familyId: string) => Promise<string>;
  removeMember: (familyId: string, userId: string) => Promise<void>;
  setCurrentFamily: (family: Family | null) => void;
}

export const useFamilyStore = create<FamilyState>((set, get) => ({
  families: [],
  currentFamily: null,
  members: [],
  isLoading: false,

  fetchFamilies: async () => {
    set({ isLoading: true });
    try {
      const families = await apiClient.getFamilies();
      set({ families, isLoading: false });
      if (families.length > 0 && !get().currentFamily) {
        set({ currentFamily: families[0] });
      }
    } catch {
      set({ isLoading: false });
    }
  },

  createFamily: async (name) => {
    const family = await apiClient.createFamily(name);
    set({ families: [...get().families, family], currentFamily: family });
  },

  joinFamily: async (inviteCode) => {
    const family = await apiClient.joinFamily(inviteCode);
    set({ families: [...get().families, family], currentFamily: family });
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

  generateInvite: async (familyId) => {
    const { invite_code } = await apiClient.generateInvite(familyId);
    const families = get().families.map((f) =>
      f.id === familyId ? { ...f, invite_code } : f
    );
    set({ families });
    if (get().currentFamily?.id === familyId) {
      set({ currentFamily: { ...get().currentFamily!, invite_code } });
    }
    return invite_code;
  },

  removeMember: async (familyId, userId) => {
    await apiClient.removeFamilyMember(familyId, userId);
    set({ members: get().members.filter((m) => m.user_id !== userId) });
  },

  setCurrentFamily: (family) => {
    set({ currentFamily: family });
  },
}));
