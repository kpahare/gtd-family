import { create } from 'zustand';
import { apiClient } from '../api/client';
import { WeeklyReview, ReviewChecklistItem } from '../types';

interface ReviewState {
  reviews: WeeklyReview[];
  checklist: ReviewChecklistItem[];
  completedSteps: Set<string>;
  isLoading: boolean;
  fetchChecklist: () => Promise<void>;
  fetchReviews: () => Promise<void>;
  toggleStep: (stepId: string) => void;
  completeReview: (notes?: string) => Promise<void>;
  resetChecklist: () => void;
}

export const useReviewStore = create<ReviewState>((set, get) => ({
  reviews: [],
  checklist: [],
  completedSteps: new Set(),
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

  toggleStep: (stepId) => {
    const completedSteps = new Set(get().completedSteps);
    if (completedSteps.has(stepId)) {
      completedSteps.delete(stepId);
    } else {
      completedSteps.add(stepId);
    }
    set({ completedSteps });
  },

  completeReview: async (notes) => {
    const review = await apiClient.createReview(notes);
    set({ reviews: [review, ...get().reviews], completedSteps: new Set() });
  },

  resetChecklist: () => {
    set({ completedSteps: new Set() });
  },
}));
