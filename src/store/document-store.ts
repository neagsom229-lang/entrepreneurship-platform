import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { DocumentItem, Category, Difficulty } from '@/types';
import { migrateLegacyStorage } from './migrate-legacy-store';

export type SortOption =
  | 'newest'
  | 'oldest'
  | 'readTimeAsc'
  | 'readTimeDesc'
  | 'alphabetical'
  | 'difficulty';

interface DocumentState {
  customDocuments: DocumentItem[];
  searchQuery: string;
  selectedCategory: Category | 'All';
  selectedDifficulty: Difficulty | 'All';
  selectedTags: string[];
  sortBy: SortOption;

  // Actions
  setSearchQuery: (query: string) => void;
  setSelectedCategory: (category: Category | 'All') => void;
  setSelectedDifficulty: (difficulty: Difficulty | 'All') => void;
  toggleTag: (tag: string) => void;
  clearAllFilters: () => void;
  setSortBy: (sort: SortOption) => void;
  addDocument: (doc: Omit<DocumentItem, 'id' | 'createdAt' | 'updatedAt'>) => void;
  deleteCustomDocument: (id: string) => void;
}

if (typeof window !== 'undefined') {
  migrateLegacyStorage();
}

export const useDocumentStore = create<DocumentState>()(
  persist(
    (set) => ({
      customDocuments: [],
      searchQuery: '',
      selectedCategory: 'All',
      selectedDifficulty: 'All',
      selectedTags: [],
      sortBy: 'newest',

      setSearchQuery: (query) => set({ searchQuery: query }),
      setSelectedCategory: (category) => set({ selectedCategory: category }),
      setSelectedDifficulty: (difficulty) => set({ selectedDifficulty: difficulty }),
      toggleTag: (tag) =>
        set((state) => {
          const exists = state.selectedTags.includes(tag);
          return {
            selectedTags: exists
              ? state.selectedTags.filter((t) => t !== tag)
              : [...state.selectedTags, tag],
          };
        }),
      clearAllFilters: () =>
        set({
          searchQuery: '',
          selectedCategory: 'All',
          selectedDifficulty: 'All',
          selectedTags: [],
        }),
      setSortBy: (sortBy) => set({ sortBy }),
      addDocument: (newDoc) => {
        const id = `custom-doc-${Date.now()}`;
        const now = new Date().toISOString();
        const doc: DocumentItem = {
          ...newDoc,
          id,
          createdAt: now,
          updatedAt: now,
        };
        set((state) => ({ customDocuments: [doc, ...state.customDocuments] }));
      },
      deleteCustomDocument: (id) =>
        set((state) => ({
          customDocuments: state.customDocuments.filter((d) => d.id !== id),
        })),
    }),
    {
      name: 'hub-document-store',
      partialize: (state) => ({
        customDocuments: state.customDocuments,
        sortBy: state.sortBy,
      }),
    }
  )
);